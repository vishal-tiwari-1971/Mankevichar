// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use another email service like Yahoo, Outlook, etc.
  auth: {
    user: 'parammiter03@gmail.com',  // Your email
    pass: 'kofl aklw ukot ftqm',   // Your email password or App password (if 2FA is enabled)
  },
});


transporter.verify((error, success) => {
  if (error) {
    console.log('Error verifying email transporter:', error);
  } else {
    console.log('Email server is ready to take our messages');
  }
});

const sendMail = (to, subject, text, html) => {
  const mailOptions = {
    from: 'parammiter03@gmail.com',
    to,
    subject,
    text,
    html,  // If you want to send HTML content
  };

  return transporter.sendMail(mailOptions,
    (error, info) => {
      if (error) {
        console.log('Error occurred while sending email:', error);
      } else {
        console.log('Email sent successfully:', info.response);
      }
    });
  
};

module.exports = sendMail;
