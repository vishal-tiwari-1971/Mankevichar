const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET, { expiresIn: '2h' });
        user.token = token;
        user.password = undefined;
        return res.status(201).json({ message: "Registered successfully", user });
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
            return res.status(401).send('Email and password are required');
        }

        // Check if the user exists in the database
        const user = await User.findOne({ email });

        // Match the password
        if (user && await bcrypt.compare(password, user.password)) {
            // Generate JWT token
            const token = jwt.sign({ id: user._id, email }, process.env.SECRET, { expiresIn: '2h' });
            user.password = undefined;
            user.token = token;

            // Create cookie and send the response
            const options = {
                expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };

            return res.status(200).cookie('token', token, options).json({
                success: true,
                token,
                user
            });
        }

        return res.status(400).send('Email or password is incorrect');
    } catch (error) {
        console.log(error);
        return res.status(500).send("There was an error during login.");
    }
};

