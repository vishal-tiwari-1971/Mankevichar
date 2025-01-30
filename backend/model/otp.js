const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiration: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Auto-delete after 10 min
});
console.log("🔹 OTP Model Loaded");

module.exports = mongoose.model("OTP", otpSchema);
