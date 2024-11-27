const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const auth = require('../middleware/auth');
const User = require('../model/user');
const Journal = require('../model/journal');


// Route for signup
router.post('/signup', userController.signup);

// Route for verifying email
//router.get('/verify-email', userController.verifyEmail);

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

    // Aggregate total likes for the user's journals
    const totalLikes = await Journal.aggregate([
      { $match: { userId: userId } }, // Filter by user ID
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } },
    ]);

    // Return the user's profile data
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      joinDate: user.joinDate,
      journals: journalsCount,
      likes: totalLikes[0]?.totalLikes || 0,
      profilePicture: user.profilePicture  // Provide a default picture if none exists
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// Logout route
router.post('/logout', userController.logout);

module.exports = router;
