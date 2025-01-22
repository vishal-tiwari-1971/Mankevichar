require("dotenv").config();
const jwt = require("jsonwebtoken");


const auth =(req, res, next) => {
  // console.log(req.cookies);
  const { token } = req.cookies
  console.log(token);
  
  // || req.header||req.body
  // or {token}=req.cookies  token=req.cookies.token

  // if token is exist
  // if (!(token)) {
  //   return res.status(403).send('login  in again token missing')
  // }
  //  to verify token
  // try {
  //   const decode =jwt.verify(token, process.env.SECRET)
  //   console.log("Decoded Token:",decode);
  //   req.user = decode

  //   next();
  // } catch (error) {
  //   console.error("JWT verification error:", error.message);
  //   return res.status(403).send("Invalid token, please log in again.");
  // }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      // Token is expired or invalid, clear the cookie
      res.clearCookie('token');
      return res.status(401).json({ message: 'Token expired or invalid' });
    }
    req.user = decoded; // Attach decoded user info to the request object
    next(); } )
  }
    

module.exports = auth;
