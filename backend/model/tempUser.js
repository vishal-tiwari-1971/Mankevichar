const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  otp: { type: String, },
  otpSentAt: { type: Date,  },
  otpExpiration: { type: Date,  },
});

const TempUser = mongoose.model('TempUser', tempUserSchema);
module.exports = TempUser;