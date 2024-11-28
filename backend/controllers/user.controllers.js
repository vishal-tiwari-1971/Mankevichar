const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/mailer.js');

// Signup logic
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!(firstName && lastName && email && password)) {
            return res.status(401).send("Please fill all the required fields");
        }

        // Checking if the email is unique
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).send("User already registered with this email");
        }

        // Password encryption
        const encryptPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: encryptPassword
        });

        // Generate JWT token (now returned after signup)
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET, { expiresIn: '2h' });
        user.token = token;
        user.password = undefined;

        // Send confirmation email after successful signup
        const subject = 'Welcome to Our Journal';
        const text = `Hello ${firstName},\n\nWelcome to our journal website! We're excited to have you.`;
        const html = `<h1>Welcome to Our Journal</h1><p>Hello ${firstName},</p><p>Welcome to our journal website! We're excited to have you.</p>`;

        await sendMail(email, subject, text, html);

        // Return the token to the frontend
        return res.status(201).json({
            message: "Registered successfully",
            token,  // Sending token directly after signup
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send("There was an error during signup.");
    }
};

// Login logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send('Email and password are required');
        }

        // Check if the user exists in the database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Match the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET, { expiresIn: '2h' });
        user.password = undefined; // Remove password from the response
        user.token = token;

        // Set token as a cookie and send response
        const options = {
            expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days
            httpOnly: true // Protect from XSS attacks
        };

        return res.status(200).cookie('token', token, options).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send("There was an error during login.");
    }
};


// Logout logic
exports.logout = (req, res) => {
    try {
        // Clear the token from the cookies (if you're storing it there)
        res.clearCookie("token");

        // Send a response back indicating the user has been logged out
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("There was an error during logout.");
    }
};


// Dashboard logic (protected route)
exports.dashboard = (req, res) => {
    res.send("Welcome to the dashboard!");
};
