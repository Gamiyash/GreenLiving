// mailer.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const generateOtp = () => {
    return crypto.randomBytes(3).toString('hex');
  };

const transporter = nodemailer.createTransport({
  service: 'Gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD // Your email password
  }
});

const sendLoginEmail = (email, username) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Successful Login Notification',
    text: `Hello ${username},\n\nYou have successfully logged in to our website.\n\nBest regards,\nOur Website Team \n Green Living`
  };



  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendLoginEmail;

// // utils/otp.js
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

// const generateOtp = () => {
//   return crypto.randomBytes(3).toString('hex');
// };

// const sendOtpEmail = (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: 'Your OTP Code',
//     text: `Your OTP code is ${otp}`
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Error sending email:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// };

// module.exports = { generateOtp, sendOtpEmail };
