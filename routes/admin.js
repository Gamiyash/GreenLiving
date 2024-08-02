// routes/admin.js
const express = require('express');
const router = express.Router();
const Echo = require('../models/data'); // Adjust the path if necessary
const Events = require('../models/event');
const Item = require('../models/item');
const adminEmails = ['admin@example.com','runpop46@gmail.com']; // List of admin emails

router.get('/admin', (req, res) => {
  if (req.session.user && adminEmails.includes(req.session.user.email)) {
    res.render('dashbord');
  } else {
    res.redirect('/login');
  }
});

router.get('/admin-blog', (req, res) => {
  if (req.session.user && adminEmails.includes(req.session.user.email)) {
  res.render('admin_blog');}
  else{
    res.redirect('/login');
  }
});
router.get('/admin-events', (req, res) => {
  if (req.session.user && adminEmails.includes(req.session.user.email)) {
  res.render('admin_event');}
  else{
    res.redirect('/login');
  }
});
router.get('/admin-items', (req, res) => {
  if (req.session.user && adminEmails.includes(req.session.user.email)) {
  res.render('admin_item');}
  else{
    res.redirect('/login');
  }

});

router.post('/admin/add-data', async (req, res) => {
  const { title, des, title2, des2, mainimg, logo, img1, img2, img3, img4, img5 } = req.body;

  try {
    const newData = new Echo({
      title,
      des,
      title2,
      des2,
      mainimg,
      logo,
      img1,
      img2,
      img3,
      img4,
      img5,
    });

    await newData.save();
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/admin/add-item', async (req, res) => {
  const {
    sf_title,
        sf_description,
        sf_price,
        sfold_price,          // Added
        sf_image,
        sf_link,
        sl_title,
        sl_description,
        sl_price,
        slold_price,          // Added
        sl_image,
        sl_link,
        Brand,                // Added
        Color,                // Added
        Material,             // Added
        Special_Feature,      // Added
        about_item   ,
        sfabout_item,
        sf_brand,
        sf_size,
        sustainability  ,
        sf_colour      // Added
  } = req.body;
  
    try {
      const newItem = new Item({
        sf_title,
        sf_description,
        sf_price,
        sfold_price,          // Added
        sf_image,
        sf_link,
        sl_title,
        sl_description,
        sl_price,
        slold_price,          // Added
        sl_image,
        sl_link,
        Brand,                // Added
        Color,                // Added
        Material,             // Added
        Special_Feature,      // Added
        about_item ,
        sfabout_item,
        sf_brand,
        sf_size,
        sustainability,
        sf_colour
      });
  
      await newItem.save();
      res.redirect('/admin');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  router.post('/admin/add-event', async (req, res) => {
    const {
      title,
      des,
      date,
      agenda1,
      agenda2,
      agenda3,
      agenda4,
      agenda5,
      spname,
      spdes,
      spimg,
      spname2,
      spdes2,
      spimg2,
      loc,
      mainimg,
    } = req.body;
  
    try {
      const newEvent = new Events({
        title,
        des,
        date,
        agenda1,
        agenda2,
        agenda3,
        agenda4,
        agenda5,
        spname,
        spdes,
        spimg,
        spname2,
        spdes2,
        spimg2,
        loc,
        mainimg,
      });
  
      await newEvent.save();
      res.redirect('/admin');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });


module.exports = router;
