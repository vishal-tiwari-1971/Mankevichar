const User = require('../model/user');
const TempUser = require('../model/tempUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/mailer.js');
const crypto = require('crypto');
const OTP = require("../model/otp")

// Signup Controller
exports.signup = async (req, res) => {
  try {


    console.log('Received data:', req.body);

    const { name, email, password } = req.body;

    // Check for missing fields
    if (!(name && email && password)) {
      return res.status(401).send("Please fill all the required fields");

    }

    const existUser = await User.findOne({ email, }) || await TempUser.findOne({ email, purpose: "registration" });
    if (existUser) {
      return res.status(400).send("User already registered with this email");
    }



     console.log("Email is unique, proceeding to password encryption...");
    // Password encryption
    const encryptPassword = await bcrypt.hash(password, 10);
    console.log('Encrypted Password:', encryptPassword);
    
    // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Save data in TempUser collection

    const tempUser = new TempUser({
      name,
      email,
      password: encryptPassword,
      otp,
      otpExpiration,
      purpose: "registration",
    });

    await tempUser.save();
    await sendMail(email, otp, "verification");

    // Respond with success
    res.status(201).send("Registered successfully. OTP sent to your email. Please verify it.");

   } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("There was an error during signup.");
  }
};

// Verify OTP Controller
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const tempUser = await TempUser.findOne({ email, purpose: "registration" });

    if (!tempUser) {
      return res.status(404).send("User not found or OTP expired");
    }

    if (tempUser.otp !== otp) {
      return res.status(400).send("Invalid OTP");
    }

    if (new Date() > tempUser.otpExpiration) {
      await TempUser.deleteOne({ email, purpose: "registration" });
      return res.status(400).send("OTP has expired");
    }

    const user = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      profilePicture: "", // Default profile picture
      joinDate: new Date(),
      journalsCount: 0,
      likedJournals: [],
      isVerified: true,
    });

    await user.save();
   // await TempUser.deleteOne({ email, purpose: "registration" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET, { expiresIn: "2h" });

    res.status(200).send("Email verified successfully and account created.");
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).send("There was an error during OTP verification.");
  }
};


// Forgot Password logic - Send OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Remove existing OTP if it exists
    await OTP.deleteOne({ email });

    // Save new OTP
    console.log("🔹 Saving OTP:", otp, "for", email);
    const newOtp = new OTP({ email, otp, otpExpiration });
    await newOtp.save();
    console.log("🔹 Saved OTP:", newOtp);

    await sendMail(email, otp, "forgotPassword");
    res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).send("Internal Server Error");
  }
};
// Reset Password Controller
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(404).send("OTP expired or not found");
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).send("Invalid OTP");
    }

    if (new Date() > otpRecord.otpExpiration) {
      await OTP.deleteOne({ email });
      return res.status(400).send("OTP has expired");
    }

    // Update user's password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: encryptedPassword });

    // Remove the OTP after successful reset
    await OTP.deleteOne({ email });

    res.status(200).send("Password reset successfully.");
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).send("There was an error resetting the password.");
  }
};




// Login logic
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).send('Email and password are required');
    }

    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    

    // Match the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email }, process.env.SECRET, { expiresIn: '2h' });
    user.password = undefined; // Remove password from the response
    user.token = token;

    // Set token as a cookie and send response
    const options = {
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Required for cross-site cookies

    };

    return res.status(200).cookie('token', token, options).json({
      success: true,
      token,
      user,
      message: 'Logged in successfully'
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("There was an error during login.");
  }
};

// Google-Login Logic
exports.googleLogin= async (req,res)=> {
  const {name,email,photoUrl,uid}= req.body;
  try{
    const user = await User.findOne({ firebaseuid: uid }) || await User.findOne({ email });
  console.log(user);
  

    if(!user)
    {
      const user= new User(
        {
          name,
          email,
          profilePicture:photoUrl,
          firebaseuid: uid,
          isVerified:true,
        }
        
        
      )
      console.log(user);
      try {
        await user.save();
    } catch (err) {
        console.error('Error saving user:', err.message);
    }
    
    }
    // else {
    //   // If the user exists, update the Firebase UID (if not already set)
    //   if (!user.firebaseUid || user.firebaseUid !== uid) {
    //     user.firebaseUid = uid;
    //     user.name = displayName; // Optional: Update displayName
    //     user.photoURL = photoURL; // Optional: Update photoURL
    //     await user.save(); // Save the updated user
    //   }
    // }
   // generating token
   const token = jwt.sign({ id: user._id, email }, process.env.SECRET, { expiresIn: '2h' });
   user.password = undefined; // Remove password from the response
   user.token = token;

    // Set token as a cookie and send response
    const options = {
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hrs
      httpOnly: true // Protect from XSS attacks
    };

    return res.status(200).cookie('token', token, options).json({
      success: true,
      token,
      user
    });
    

  }
  catch(error) {
    res.status(500).json({message:"Getting error",error})
  }
}
// Logout logic
exports.logout = (req, res) => {
  try {
    // Clear the token from the cookies (if you're storing it there)
    res.clearCookie("token");

    // Send a response back indicating the user has been logged out
    return res.status(200).json({
       message: "Logged out successfully",
        // googleLogoutUrl: "https://accounts.google.com/logout"
     });
  } catch (error) {
    console.error(error);
    return res.status(500).send("There was an error during logout.");
  }
};


// Dashboard logic (protected route)
exports.dashboard = (req, res) => {
  res.send("Welcome to the dashboard!");
};
