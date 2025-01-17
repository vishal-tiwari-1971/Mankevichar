const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  otp: { type: String, required: true },
  otpSentAt: { type: Date, required: true },
  otpExpiration: { type: Date, required: true },
});

const TempUser = mongoose.model('TempUser', tempUserSchema);
module.exports = TempUser;
