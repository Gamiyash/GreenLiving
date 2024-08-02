// In routes/user.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get user profile
router.get('/profile', async (req, res) => {
    try {
      if (!req.session.user) return res.redirect('/login');
  
      const user = await User.findById(req.session.user._id);
      if (!user) return res.status(404).send('User not found');
  
      res.render('profile', { user });
      console.log('Profile route accessed');
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

// Update user profile
router.post('/profile', upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');

    const { username, bio } = req.body;
    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send('User not found');

    user.username = username || user.username;
    // user.birthday = birthday || user.birthday
    user.bio = bio || user.bio;
    if (req.file) user.profilePicture = req.file.filename;

    await user.save();
    res.redirect('/user/profile');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

// router.post('/profile', async (req, res) => {
//     try {
//       if (!req.session.user) return res.redirect('/login');
  
//       const { username, email, birthday, bio } = req.body;
//       const profilePicture = req.file ? req.file.filename : null;
  
//       // Ensure all fields are processed and saved correctly
//       const updatedUser = await User.findByIdAndUpdate(
//         req.session.user._id,
//         { username, email, birthday, bio, profilePicture },
//         { new: true, runValidators: true }
//       );
  
//       if (!updatedUser) return res.status(404).send('User not found');
  
//       res.redirect('/user/profile');
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   });
  

module.exports = router;
