require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    if (!req.cookies || !req.cookies.token) {
      return res.status(403).send("Token missing, please log in again.");
    }

    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.SECRET);

    console.log("Decoded Token:", decoded);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(403).send("Invalid token, please log in again.");
  }
};

module.exports = auth;
