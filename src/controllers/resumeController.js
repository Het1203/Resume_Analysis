const axios = require('axios');
const Applicant = require('../models/applicantModel');
const { verifyToken } = require('../utils/jwtUtil');
const { encrypt, decrypt } = require('../utils/encryptionUtil');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.enrichResume = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        verifyToken(token);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    const { raw_text } = req.body;
    if (!raw_text) return res.status(404).json({ error: 'No data detected in raw text' });

    console.log('Processing resume...');
    console.log('Calling Gemini API...', process.env.GEMINI_API_KEY);

    try {
        const schema = {
            description: "Resume data",
            type: SchemaType.OBJECT,
            properties: {
                name: { type: SchemaType.STRING, description: "Name of the applicant", nullable: true },
                email: { type: SchemaType.STRING, description: "Email of the applicant", nullable: true },
                education: {
                    type: SchemaType.OBJECT,
                    properties: {
                        degree: { type: SchemaType.STRING, description: "Degree obtained", nullable: true },
                        branch: { type: SchemaType.STRING, description: "Branch of study", nullable: true },
                        institution: { type: SchemaType.STRING, description: "Institution name", nullable: true },
                        year: { type: SchemaType.STRING, description: "Year of graduation", nullable: true }
                    },
                    nullable: true
                },
                experience: {
                    type: SchemaType.OBJECT,
                    properties: {
                        job_title: { type: SchemaType.STRING, description: "Job title", nullable: true },
                        company: { type: SchemaType.STRING, description: "Company name", nullable: true }
                    },
                    nullable: true
                },
                skills: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, nullable: true },
                summary: { type: SchemaType.STRING, description: "Summary of the applicant", nullable: true }
            },
            required: []
        };

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const prompt = `Extract the following information from the resume text: ${raw_text}`;
        const result = await model.generateContent(prompt);

        const enrichedData = JSON.parse(result.response.text());

        // Encrypt sensitive data before saving to the database
        const encryptedData = {
            ...enrichedData,
            name: encrypt(enrichedData.name),
            email: encrypt(enrichedData.email)
        };

        // Save the encrypted data to the database
        const newApplicant = new Applicant(encryptedData);
        await newApplicant.save();

        // Decrypt sensitive data before sending the response
        const responseData = {
            ...enrichedData,
            name: decrypt(encryptedData.name),
            email: decrypt(encryptedData.email)
        };

        res.status(200).json(responseData);
    } catch (err) {
        console.error('Error processing resume:', err.message);
        res.status(500).json({ error: 'Error processing resume' });
    }
};