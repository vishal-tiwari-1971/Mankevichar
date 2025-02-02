const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const auth = require('../middleware/auth');
const User = require('../model/user');
const Journal = require('../model/journal');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Message = require('../model/message'); // Import the Message model
const nodemailer = require('nodemailer');


// Route for sending OTP
router.post('/verify-otp', userController.verifyOtp);

// Route for signup
router.post('/signup', userController.signup);


// Route for registering using Google
router.post("/google-login",userController.googleLogin)

// Forgot password (send OTP)
router.post('/forgot-password', userController.forgotPassword);

// Reset password (after OTP verification)
router.post('/reset-password', userController.resetPassword);

// Route for login
router.post('/login', userController.login);

// Profile route
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming `auth` middleware attaches the user object
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    

    // Count the number of journals created by the user
    const journalsCount = await Journal.countDocuments({ userId });

     // Count the number of journals liked by the user
     const likedJournalsCount = await Journal.countDocuments({ likes: userId });

    // Return the user's profile data
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      joinDate: user.joinDate,
      journals: journalsCount,
      likedJournals: likedJournalsCount,
      profilePicture: user.profilePicture, 
      
       // Provide a default picture if none exists
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

//user liked journals
router.get('/liked-journals', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('likedJournals');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.likedJournals);
  } catch (error) {
    console.error('Error fetching liked journals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Edit Profile Route
router.put('/edit/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;

  console.log('Editing Profile for ID:', id);
  console.log('Payload Received:', req.body);

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate fields
   
    if (name && typeof name === 'string') user.name = name;
    if (password && typeof password === 'string' && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        // firstName: user.firstName,
        // lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// message 
router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;

    // Fetch the logged-in user's details
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Save message in the database
    const newMessage = new Message({
      userId: user._id,
      message,
    });
    await newMessage.save();

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'parammiter03@gmail.com', // Your email (admin)
        pass: 'kofl aklw ukot ftqm', // App Password
      },
    });

    // Email Options
    const mailOptions = {
      from: `${user.name} <${user.email}>`, // Set user's email as sender
      to: 'parammiter03@gmail.com', // Admin email to receive messages
      subject: `New Support Message from ${user.name}`,
      text: `You received a new message:\n\nUser: ${user.name}\nEmail: ${user.email}\n\nMessage:\n${message}`,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent and email delivered!' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Logout route
router.post('/logout', userController.logout);

module.exports = router;