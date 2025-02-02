import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';

const Support = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('You must be logged in to send a message.');
          return;
        }

        const response = await axios.get('/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data && response.data.email) {
          setUserEmail(response.data.email);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user details. Please log in again.');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      console.log('Razorpay script loaded');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('You must be logged in to send a message.');
      return;
    }

    try {
      const response = await axios.post(
        '/user/message',
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setMessage('');
      }
    } catch (err) {
      setError('Something went wrong, please try again later.');
    }
  };

  // Handle Razorpay payment
  const initiatePayment = async () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    try {
      const orderResponse = await axios.post('/payment/create-order', { amount });
      if (orderResponse.status === 200) {
        setOrderId(orderResponse.data.orderId);

        const options = {
          key: 'rzp_test_KkVliXojaIDN7W', // Replace with your Razorpay API Key
          amount: amount * 100, // Convert amount to paise
          currency: 'INR',
          order_id: orderResponse.data.orderId,
          name: 'Man Ke Vichar',
          description: 'Support Us with a Donation',
          image: '',
          handler: function (response) {
            console.log('Payment successful', response);
            alert('Payment Successful! Thank you for supporting us.');
          },
          theme: {
            color: '#528FF0',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      setError('Something went wrong while processing the payment.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="support-container p-6 dark:bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">Support Us</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">How You Can Contribute</h2>
          <p className="text-lg mb-4">
            We appreciate your support in making our platform better! Here's how you can contribute:
          </p>

          {/* Donation Section */}
          <div className="bg-gray-800 p-4 rounded-lg mb-6 dark:text-white">
            <h3 className="font-semibold text-xl mb-2">Support Us with a Donation</h3>
            <p>If you would like to contribute financially, you can donate via UPI or CARD.</p>
            <div className="contribute-container p-6">
              <label htmlFor="amount" className="block text-lg font-semibold mb-2">
                Enter Contribution Amount (INR)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter amount"
              />
              {error && <p className="mt-2 text-red-500">{error}</p>}
              <button
                type="button"
                onClick={initiatePayment}
                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Proceed to Payment
              </button>
            </div>
          </div>

          {/* Bug Report / Suggestion Section */}
          <div className="bg-gray-800 p-4 rounded-lg dark:text-white">
            <h3 className="font-semibold text-xl mb-2">Report a Bug or Suggest an Improvement</h3>
            <p>Your feedback helps us improve the platform. Please share any issues or suggestions:</p>
            <form onSubmit={handleSubmit} className="mt-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows="6"
                placeholder="Enter your message here"
              ></textarea>
              <button
                type="submit"
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            </form>

            {error && <p className="mt-4 text-red-500">{error}</p>}
            {success && <p className="mt-4 text-green-500">Your message has been sent successfully!</p>}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-lg mb-4">
            If you have any questions or want to contribute in other ways, feel free to contact us:
          </p>
          <p>Email us at: <a href="mailto:parammiter03@gmail.com" className="text-blue-500 dark:text-yellow-500">parammiter03@gmail.com</a></p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
