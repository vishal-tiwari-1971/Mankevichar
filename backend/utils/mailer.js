const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can use another email service if needed
  auth: {
    user: 'parammiter03@gmail.com',  // Your email address
    pass: 'kofl aklw ukot ftqm',   // Your email password or App password
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('Error verifying email transporter:', error);
  } else {
    console.log('Email server is ready to take our messages');
  }
});

// Function to send OTP email
const sendOTPEmail = (to, otp) => {
  const mailOptions = {
    from: 'parammiter03@gmail.com',
    to,
    subject: 'Action Required: Verify Your Email Address to Complete Registration',
    text: `
      Dear User,
  
      Thank you for registering with Man Ke Vichar. To complete your registration and activate your account, please verify your email address by entering the One-Time Password (OTP) provided below.
  
      Your OTP Code: ${otp}
  
      For security reasons, this OTP will expire in 10 minutes. If you did not initiate this request, please disregard this email.
  
      To verify your account, please click the link below or copy and paste it into your browser:
      [Verification Link]
  
      If you need any assistance or have questions, please don't hesitate to reach out to our support team at [Support Email Address].
  
      Thank you for choosing Man Ke Vichar. We look forward to having you with us.
  
      Best regards,
      The Man Ke Vichar Team
    `,
    html: `
      <p>Dear User,</p>
      <p>Thank you for registering with <strong>Men Ke Vichar</strong>. To complete your registration and activate your account, please verify your email address by entering the One-Time Password (OTP) provided below.</p>
  
      <p><strong>Your OTP Code:</strong> ${otp}</p>
  
      <p>For security reasons, this OTP will expire in 10 minutes. If you did not initiate this request, please disregard this email.</p>
  
      <p>To verify your account, please click the link below or copy and paste it into your browser:<br>
      <a href="[Verification Link]">parammiter03@gmail.com</a></p>
  
      <p>If you need any assistance or have questions, please don't hesitate to reach out to our support team at <a href="mailto:[Support Email Address]">[Support Email Address]</a>.</p>
  
      <p>Thank you for choosing <strong>Man Ke Vichar</strong>. We look forward to having you with us.</p>
  
      <p>Best regards,<br>
      The Man Ke Vichar Team</p>
    `,
  };
  

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred while sending email:', error);
    } else {
      console.log('Email sent successfully:', info.response);
    }
  });
};

module.exports = sendOTPEmail;