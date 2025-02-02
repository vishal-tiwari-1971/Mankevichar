require("dotenv").config();
const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {

    let token;
  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Check cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT Error:', err);
      res.clearCookie('token');
      return res.status(401).json({ message: 'Invalid/expired token' });
    }
    req.user = decoded;
    next();
  });
};
    

module.exports = auth;