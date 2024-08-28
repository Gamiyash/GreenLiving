// // auth.js
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const passport = require('passport');
// const sendLoginEmail = require('../routes/mailer.js');

// router.get('/login', (req, res) => res.render('login'));
// router.get('/signup', (req, res) => res.render('signup'));

// router.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).render('signup', { error: 'User already exists' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user = new User({ username, email, password: hashedPassword });
//     await user.save();
//     res.redirect('/auth/login');
//   } catch (err) {
//     console.error(err);
//     res.status(500).render('signup', { error: 'Server error' });
//   }
// });

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).render('login', { error: 'Invalid credentials' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).render('login', { error: 'Invalid credentials' });
//     }
//     req.login(user, (err) => {
//       if (err) return next(err);

//       // Send login email
//       sendLoginEmail(user.email, user.username);
//       req.session.user = user;
//       return res.redirect('/home');
//     });


//     // req.session.user = user;
//     // res.redirect('/home');
//   } catch (err) {
//     console.error(err);
//     res.status(500).render('login', { error: 'Server error' });
//   }
// });

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // Google OAuth Callback
// router.get('/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//         req.session.user = req.user;
//         res.redirect('/home');
//     }
// );

// // Logout Route
// router.get('/logout', (req, res) => {
//     req.logout();
//     req.session.destroy(err => {
//         res.redirect('/login');
//     });
// });


// module.exports = router;

// // auth.js
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const passport = require('passport');
// const User = require('../models/User');
// const { generateOtp, sendOtpEmail } = require('../routes/mailer.js');

// router.get('/login', (req, res) => res.render('login'));
// router.get('/signup', (req, res) => res.render('signup'));

// router.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).render('signup', { error: 'User already exists' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     user = new User({ username, email, password: hashedPassword });
//     await user.save();
//     res.redirect('/auth/login');
//   } catch (err) {
//     console.error(err);
//     res.status(500).render('signup', { error: 'Server error' });
//   }
// });

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).render('login', { error: 'Invalid credentials' });
//     }
//     // const isMatch = await user.comparePassword(password);
//     // if (!isMatch) {
//     //   return res.status(400).render('login', { error: 'Invalid credentials' });
//     // }
//     const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//           return res.status(400).render('login', { error: 'Invalid credentials' });
//         }

//     // Generate and store OTP
//     const otp = generateOtp();
//     user.otp = otp;
//     user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
//     await user.save();

//     // Send OTP email
//     sendOtpEmail(user.email, otp);

//     res.render('otp', { email: user.email }); // Render OTP input form
//   } catch (err) {
//     console.error(err);
//     res.status(500).render('login', { error: 'Server error' });
//   }
// });

// // OTP verification route
// router.post('/verify-otp', async (req, res) => {
//   const { email, otp } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).render('otp', { error: 'Invalid credentials', email });
//     }

//     // Check if OTP is valid and not expired
//     if (user.otp === otp && user.otpExpires > Date.now()) {
//       // Clear OTP fields after successful verification
//       user.otp = null;
//       user.otpExpires = null;
//       await user.save();

//       // Send login email
//       sendLoginEmail(user.email, user.username);

//       req.session.user = user;
//       return res.redirect('/home');
//     } else {
//       return res.status(400).render('otp', { error: 'Invalid or expired OTP', email });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).render('otp', { error: 'Server error', email });
//   }
// });

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// // Google OAuth Callback
// router.get('/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//         req.session.user = req.user;
//         res.redirect('/home');
//     }
// );

// // Logout Route
// router.get('/logout', (req, res) => {
//     req.logout();
//     req.session.destroy(err => {
//         res.redirect('/login');
//     });
// });

// module.exports = router;

// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { generateOtp, sendOtpEmail } = require('../utils/otp.js');
const sendLoginEmail = require('../routes/mailer.js');

router.get('/login', (req, res) => res.render('login'));
router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).render('signup', { error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.status(500).render('signup', { error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render('login', { error: 'Invalid credentials' });
    }
    // const isMatch = await user.comparePassword(password);
    // if (!isMatch) {
    //   return res.status(400).render('login', { error: 'Invalid credentials' });
    // }
    const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
              return res.status(400).render('login', { error: 'Invalid credentials' });
            }

    // Generate and store OTP
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();

    // Send OTP email
    sendOtpEmail(user.email, otp);

    res.render('otp', { email: user.email, error: '' }); // Initialize error as empty string
  } catch (err) {
    console.error(err);
    res.status(500).render('login', { error: 'Server error' });
  }
});

// OTP verification route
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render('otp', { error: 'Invalid credentials', email });
    }

    // Check if OTP is valid and not expired
    if (user.otp === otp && user.otpExpires > Date.now()) {
      // Clear OTP fields after successful verification
      user.otp = null;
      user.otpExpires = null;
      await user.save();

      // Send login email
      sendLoginEmail(user.email, user.username);

      req.session.user = user;
      return res.redirect('/');
    } else {
      return res.status(400).render('otp', { error: 'Invalid or expired OTP', email });
    }
  } catch (err) {
    console.error(err);
    res.status(500).render('otp', { error: 'Server error', email });
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth Callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// Logout Route
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy(err => {
    res.redirect('/login');
  });
});

module.exports = router;

