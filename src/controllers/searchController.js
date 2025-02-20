const Applicant = require('../models/applicantModel');
const { verifyToken } = require('../utils/jwtUtil');
const { decrypt } = require('../utils/encryptionUtil');

exports.searchResume = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        verifyToken(token);
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    try {
        const applicants = await Applicant.find();
        const decryptedApplicants = applicants.map(applicant => {
            try {
                const decryptedName = decrypt(applicant.name);
                const decryptedEmail = decrypt(applicant.email);
                return {
                    ...applicant._doc,
                    name: decryptedName,
                    email: decryptedEmail
                };
            } catch (decryptError) {
                // console.error('Error decrypting applicant data:', decryptError.message);
                return null;
            }
        }).filter(applicant => applicant !== null);

        const matchingApplicants = decryptedApplicants.filter(applicant =>
            applicant.name.toLowerCase().includes(name.toLowerCase())
        );

        if (matchingApplicants.length === 0) return res.status(404).json({ error: 'No matching records found' });

        res.status(200).json(matchingApplicants);
    } catch (err) {
        console.error('Error searching resumes:', err.message);
        res.status(500).json({ error: 'Error searching resumes' });
    }
};