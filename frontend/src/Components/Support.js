import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Support = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      // Send the contribution (suggestion/bug report)
      const response = await axios.post('/api/support/contribute', { message });
      if (response.status === 200) {
        setSuccess(true);
        setMessage('');
      }
    } catch (err) {
      setError('Something went wrong, please try again later.');
    }
  };

  return (
    <div>
        <Navbar/>
    <div className="support-container p-6 dark:bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Support Us</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">How You Can Contribute</h2>
        <p className="text-lg mb-4">
          We appreciate your support in making our platform better! Here's how you can contribute:
        </p>

        {/* Donation Section (Optional) */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6 dark:text-white">
          <h3 className="font-semibold text-xl mb-2">Support Us with a Donation</h3>
          <p>If you would like to contribute financially, you can donate to us via UPI , CARD.</p>
          {/* <a
            href="https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID"
            className="text-blue-500 underline mt-2 inline-block"
          >
            Donate Now
          </a> */}
          <div className="contribute-container p-6">
            <form onSubmit={handleSubmit} className="mb-6">
        <label htmlFor="amount" className="block text-lg font-semibold mb-2">
          Enter Contribution Amount
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
          type="submit"
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
        </div>

        {/* Bug Report / Suggestion Section */}
        <div className="bg-gray-800 p-4 rounded-lg dark:text-white">
          <h3 className="font-semibold text-xl mb-2">Report a Bug or Suggest an Improvement</h3>
          <p>Your feedback helps us improve the platform. Please share any issues or suggestions you have:</p>

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

      {/* Contact Section (Optional) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-lg mb-4">
          If you have any other questions or want to contribute in other ways, feel free to contact us directly:
        </p>
        <p>Email us at: <a href="mailto:parammiter03@gmail.com" className="text-blue-500 dark:text-yellow-500">parammiter03@gmail.com</a></p>
      </section>
    </div>
    </div>
  );
};

export default Support;
