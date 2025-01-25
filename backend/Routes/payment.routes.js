const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controllers');
const auth = require('../middleware/auth');


// Route to handle order creation
router.post('/create-order', paymentController.createOrder);

// Route to serve the success page
router.get('/payment-success', paymentController.paymentSuccess);

// Route to handle payment verification
router.post('/verify-payment', paymentController.verifyPayment)

module.exports = router;