// routes/home.js
// routes/home.js
const express = require('express');
const router = express.Router();
const Echo = require('../models/data');

router.get('/', async (req, res) => {
  try {
    const data = await Echo.findOne();
    if (data) {
      res.render('index', { title: data.title, des: data.des, user: req.session.user });
      console.log(data);
      console.log(user);
    } else {
      res.render('index', { title: 'No data found', user: req.session.user });
      console.log('No data found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

