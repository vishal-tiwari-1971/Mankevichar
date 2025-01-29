const User = require('../model/user');
const TempUser = require('../model/tempUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/mailer.js');
const crypto = require('crypto');

// Signup logic
exports.signup = async (req, res) => {
  try {

    console.log('Received data:', req.body);

    const { name, email, password } = req.body;

    // Check for missing fields
    if (!(name && email && password)) {
      return res.status(401).send("Please fill all the required fields");

    }

    // Check if the email is unique
    const existUser = await User.findOne({ email }) || await TempUser.findOne({ email });
    if (existUser) {
      return res.status(400).send("User already registered with this email");
    }
     console.log("Email is unique, proceeding to password encryption...");
    // Password encryption
    const encryptPassword = await bcrypt.hash(password, 10);
    console.log('Encrypted Password:', encryptPassword);
    
    // Generate OTP
    const otp = crypto.randomBytes(3).toString('hex');
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Save data in TempUser collection
    const tempUser = new TempUser({
      name,
      email,
      password: encryptPassword,
      otp,
      otpSentAt: new Date(),
      otpExpiration,
    });

    await tempUser.save();
    await sendMail(email, otp);

    // Respond with success
    res.status(201).send("Registered successfully. OTP sent to your email. Please verify it.");

   } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("There was an error during signup.");
  }
};

// OTP verification logic
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(404).send('User not found or OTP expired');
    }

    if (tempUser.otp !== otp) {
      return res.status(400).send('Invalid OTP');
    }

    if (new Date() > tempUser.otpExpiration) {
      await TempUser.deleteOne({ email });
      return res.status(400).send('OTP has expired');
    }

    // Move user to the User collection
    const user = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      profilePicture: '', // Default profile picture
      joinDate: new Date(),
      journalsCount: 0,
      likedJournals: [],
      isVerified: true,
    });

    await user.save();
    await TempUser.deleteOne({ email });

    // Generate JWT token 
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET, { expiresIn: '2h' });

    res.status(200).send('Email verified successfully and account created.');
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).send("There was an error during OTP verification.");
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
