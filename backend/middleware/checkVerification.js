const User = require('../model/user.js'); // Adjust the path based on your project structure
const auth=require('./auth.js')


const checkVerification = async (req, res, next) => {
    try {
        const userId = req.user.id; // Assuming user ID is added to the request by the `auth` middleware

        // Find the user in the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Your account is not verified. Please verify your email.',
                redirectTo: '/verify', // Frontend route for the verification page
            });
        }

        // If verified, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in checkVerification middleware:', error);
        return res.status(500).json({ message: 'Server error during verification check.' });
    }
};

module.exports = checkVerification;
