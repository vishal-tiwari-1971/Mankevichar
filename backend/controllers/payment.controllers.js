const { razorpay, readData, writeData } = require('../utils/razorpay');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
// order creation logic
exports.createOrder = async (req, res) => {
    try {
      const { amount } = req.body;
  
      const options = {
        amount: amount * 100, // Convert amount to paise
        currency: 'INR', // Use INR or your desired currency
        receipt: 
        // receipt ||
         'receipt#1', // A unique receipt identifier
        notes: 
        // notes ||
         {}, // Optional notes
      };
  
      const order = await razorpay.orders.create(options);
      
      // Read current orders, add new order, and write back to the file
      const orders = readData();
      orders.push({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: 'created',
      });
      writeData(orders);
  
      res.json(order); // Send order details to frontend, including order ID
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating order');
    }
  }

  // payment success logic 
  exports.paymentSuccess =(req, res) => {
    res.send('payment successful');
  };

  
  // payment verification logic
  exports.verifyPayment = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
    const secret = razorpay.key_secret;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
  
    try {
      const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
      if (isValidSignature) {
        // Update the order with payment details
        const orders = readData();
        const order = orders.find(o => o.order_id === razorpay_order_id);
        if (order) {
          order.status = 'paid';
          order.payment_id = razorpay_payment_id;
          writeData(orders);
        }
        res.status(200).json({ status: 'ok' });
        console.log("Payment verification successful");
      } else {
        res.status(400).json({ status: 'verification_failed' });
        console.log("Payment verification failed");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error verifying payment' });
    }
  }