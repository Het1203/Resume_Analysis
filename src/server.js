const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes.js');
const resumeRoutes = require('./routes/resumeRoutes.js');
const searchRoutes = require('./routes/searchRoutes.js');


const app = express();
require('dotenv').config();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/resume', resumeRoutes);
app.use('/search', searchRoutes);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err);
    });