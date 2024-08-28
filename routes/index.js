// // const express = require('express');
// // const router = express.Router();
// // const Echo = require('../models/data');
// // const Events = require('../models/event'); // Import the events model

// // router.get('/home', async (req, res) => {
  
// //     try {
// //       const data = await Echo.find({});
// //       const events = await Events.find({}); // Fetch event data

// //       if (data.length > 0 || events.length > 0) {
// //         res.render('index', { blogs: data, events: events, user: req.session.user });
// //         console.log({ data, events });
// //       } else {
// //         res.render('index', { blogs: [], events: [], user: req.session.user });
// //         console.log('No data or events found');
// //       }
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //       res.status(500).json({ error: 'Internal Server Error' });
// //     }
  
// // });

// // module.exports = router;

// const express = require('express');
// const passport = require('passport');
// const session = require('express-session');
// const Echo = require('../models/data');
// const Events = require('../models/event'); // Import the events model

// require('./passport-setup'); // Include the passport setup

// const router = express.Router();

// // Session setup
// router.use(session({
//   secret: 'your_secret_key',
//   resave: false,
//   saveUninitialized: true
// }));
// router.use(passport.initialize());
// router.use(passport.session());

// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/auth/login' }),
//   (req, res) => {
//     req.session.user = req.user; // Save user info in session
//     res.redirect('/home'); // Redirect to the home page after successful login
//   }
// );

// router.get('/auth/logout/callback', (req, res) => {
//   req.logout();
//   req.session.destroy();
//   res.redirect('/home');
// });


// router.get('/home', async (req, res) => {
//   try {
//     const data = await Echo.find({});
//     const events = await Events.find({}); // Fetch event data

//     if (data.length > 0 || events.length > 0) {
//       res.render('index', { blogs: data, events: events, user: req.session.user });
//       console.log({ data, events });
//     } else {
//       res.render('index', { blogs: [], events: [], user: req.session.user });
//       console.log('No data or events found');
//     }
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const Echo = require('../models/data');
const Events = require('../models/event');
const Item = require('../models/item'); // Import the events model

require('./passport-setup'); // Include the passport setup

const router = express.Router();

// Session setup
router.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login' }),
  (req, res) => {
    req.session.user = req.user; // Save user info in session
    res.redirect('/home'); // Redirect to the home page after successful login
  }
);

router.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.redirect('/login'); // Redirect to the login page after logout
  });
});

router.get('/', async (req, res) => {
  try {
    const [data, events, items] = await Promise.all([
      Echo.find({}).limit(6),
      Events.find({}).limit(3),
      Item.find({}).limit(4),
    ]);

    res.render('index', { blogs: data, events: events, items: items, user: req.session.user });
    console.log({ data, events, items });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
