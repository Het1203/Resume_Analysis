const { generateToken } = require('../utils/jwtUtil');
require('dotenv').config();

const hardCodedCredentials = {
    username: "naval.ravikant",
    password: "05111974"
};

exports.authenticateUser = (req, res) => {
    const { username, password } = req.body;
    if (username === hardCodedCredentials.username && password === hardCodedCredentials.password) {
        const token = generateToken({ username });
        res.status(200).json({ JWT: token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};