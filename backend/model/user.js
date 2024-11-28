const mongoose = require('mongoose');

// Creating schema for user
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profilePicture: {
    type: String,
    default: '', // Default image URL if none is provided
  },
  joinDate: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
  journalsCount: {
    type: Number,
    default: 0, // Default value when a new user is created
  },
  likedJournals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Journal' }]
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
