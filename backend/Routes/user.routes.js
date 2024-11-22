const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const auth = require('../middleware/auth');
const User = require('../model/user');

// Route for signup
router.post('/signup', userController.signup);

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
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      joinDate: user.joinDate,
      journals: user.journalsCount,
      likes: user.likesCount,
      profilePicture: user.profilePicture, // Updated to match schema field
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// Logout route
router.post('/logout', userController.logout);

module.exports = router;
