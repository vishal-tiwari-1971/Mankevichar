const mongoose = require('mongoose');

// Creating schema for user
const userSchema = new mongoose.Schema({
  name: {
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
    required:false,
    // minlength: 8,
    default:"",
  },
  profilePicture: {
    type: String,
    default: '', // Default image URL if none is provided
  },
  firebaseuid:{
    type: String,
    unique:true,
    default:"",
  },
  joinDate: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
  journalsCount: {
    type: Number,
    default: 0, // Default value when a new user is created
  },
  likedJournals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Journal' }],
  otp: { type: String }, // Store OTP
  otpSentAt: Date,
  otpExpiration: { type: Date }, // Store OTP expiration time
  isVerified: { type: Boolean, default: false },
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
