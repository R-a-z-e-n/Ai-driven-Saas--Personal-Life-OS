const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'razeeniqbla555@gmail.com',
        pass: '213085629'
    }
});

// Generate OTP
app.post('/generate-otp', (req, res) => {
    const secret = speakeasy.generateSecret();
    const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
    });

    const mailOptions = {
        from: 'razeeniqbla555@gmail.com',
        to: req.body.email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.status(500).json({ error: 'Failed to send OTP' });
        } else {
            res.json({ secret: secret.base32 });
        }
    });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
    const verified = speakeasy.totp.verify({
        secret: req.body.secret,
        encoding: 'base32',
        token: req.body.otp,
        window: 2
    });

    res.json({ verified });
});

// Simulate fingerprint verification
app.post('/verify-fingerprint', (req, res) => {
    // Simulated fingerprint verification
    const success = Math.random() > 0.1; // 90% success rate
    res.json({ verified: success });
});

// Status endpoint
app.get('/status', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Add this at the end of the file
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});