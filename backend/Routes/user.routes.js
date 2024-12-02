const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const auth = require('../middleware/auth');
const User = require('../model/user');
const Journal = require('../model/journal');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Route for signup
router.post('/signup', userController.signup);

// Route for sending OTP
router.post('/verify-otp', userController.verifyOtp);


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
      firstName: user.firstName,
      lastName: user.lastName,
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
  const { firstName, lastName, password } = req.body;

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
    if (firstName && typeof firstName === 'string') user.firstName = firstName;
    if (lastName && typeof lastName === 'string') user.lastName = lastName;
    if (password && typeof password === 'string' && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});


// Logout route
router.post('/logout', userController.logout);

module.exports = router;
