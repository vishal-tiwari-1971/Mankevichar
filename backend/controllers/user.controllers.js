const User = require('../model/user');
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
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).send("User already registered with this email");
    }

    console.log("Email is unique, proceeding to password encryption...");

    // Password encryption
    const encryptPassword = await bcrypt.hash(password, 10);
    console.log('Encrypted Password:', encryptPassword);

    // Create a new user object
    const user = new User({
      name,
      email,
      password: encryptPassword,
    });

    console.log("Created user object, starting validation...");

    // Validate the user object (using async/await)
    await user.validate(); // This will throw an error if validation fails

    console.log("Validation passed, saving user...");

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email }, process.env.SECRET, { expiresIn: '2h' });

    // Send OTP (assuming you have sendMail logic)
    const otp = crypto.randomBytes(3).toString('hex');
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    await sendMail(email, otp);

    // Respond with success
    res.status(201).json({
      message: "Registered successfully. OTP sent to your email. Please verify it.",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    if (error.name === "ValidationError") {
      return res.status(400).send(`Validation failed: ${error.message}`);
    }
    return res.status(500).send("There was an error during signup.");
  }
};



// OTP verification logic
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp) {
      return res.status(400).send('Invalid OTP');
    }

    if (new Date() > user.otpExpiration) {
      return res.status(400).send('OTP has expired');
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined; // Clear OTP
    user.otpExpiration = undefined; // Clear expiration time
    await user.save();

    // Return success message
    res.status(200).send('Email verified successfully');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error during OTP verification');
  }
};

// exports.resendOTP = async (req, res) => {
//   const user = req.user; // Assuming user is authenticated
//   if (!user) {
//       return res.status(401).send("User not authenticated");
//   }

//   if (user.verified) {
//       return res.status(400).send("User already verified.");
//   }

//   const currentTime = new Date();
//   const timeDifference = (currentTime - user.otpSentAt) / (1000 * 60); // Difference in minutes

//   if (timeDifference < 10) {
//       return res.status(429).json({ message: 'Please wait before requesting a new OTP.' });
//   }

  // Generate a new OTP
//   const newOtp = crypto.randomInt(100000, 999999).toString();
//   user.otp = newOtp;
//   user.otpSentAt = currentTime;

//   //await user.save();

//   // Send the OTP to user's email
//   await sendMail(user.email, 'Your Verification OTP', `Your OTP is: ${newOtp}`);
//   res.status(200).json({ message: 'New OTP sent to your email.' });
// };


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
      expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days
      httpOnly: true // Protect from XSS attacks
    };

    return res.status(200).cookie('token', token, options).json({
      success: true,
      token,
      user
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
      expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days
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
