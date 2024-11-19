const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers');
const auth = require("../middleware/auth");

// Route for signup
router.post("/signup", userController.signup);

// Route for login
router.post("/login", userController.login);

module.exports = router;