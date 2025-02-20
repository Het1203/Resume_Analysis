const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    degree: String,
    branch: String,
    institution: String,
    year: String
});

const experienceSchema = new mongoose.Schema({
    job_title: String,
    company: String,
    start_date: String,
    end_date: String
});

const applicantSchema = new mongoose.Schema({
    name: String,
    email: String,
    education: educationSchema,
    experience: experienceSchema,
    skills: [String],
    summary: String
});

module.exports = mongoose.model('Applicant', applicantSchema);