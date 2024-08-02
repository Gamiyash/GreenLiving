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


const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Function to generate a random OTP
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// Function to send OTP email
async function sendOtpEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
}

module.exports = { generateOtp, sendOtpEmail };
