const Razorpay = require('razorpay');
const fs = require('fs');

// Replace with your Razorpay credentials
const razorpay = new Razorpay({
  key_id: 'rzp_test_KkVliXojaIDN7W',
  key_secret: 'Whn0Mk8ejY8QnMUAWvo9MNQk',
});

// Function to read data from JSON file
const readData = () => {
  if (fs.existsSync('orders.json')) {
    const data = fs.readFileSync('orders.json');
    return JSON.parse(data);
  }
  return [];
};

// Function to write data to JSON file
const writeData = (data) => {
  fs.writeFileSync('orders.json', JSON.stringify(data, null, 2));
};

// Initialize orders.json if it doesn't exist
if (!fs.existsSync('orders.json')) {
  writeData([]);
}

module.exports = { razorpay, readData, writeData };
