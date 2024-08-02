// routes/home.js
// routes/home.js
const express = require('express');
const router = express.Router();
const items = require('../models/item');
const Comment = require('../models/comment');
const ProductComment = require('../models/productComment');

router.get('/', async (req, res) => {
  try {
    const idata = await items.findOne();
    if (idata) {
      res.render('index', { sl_title : idata.sl_title , sl_des: idata.sl_description , sl_img:idata.sl_image,sl_price:idata.sl_price,sf_title:idata.sf_title,sf_des:idata.sf_description,sf_img:idaya.sf_img,sf_price:idata.sf_price });
      console.log(idata);
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

 // Import the Comment model

 
 router.get('/product/:id', async (req, res) => {
  if (req.session.user) {
  try {
    
    const product = await items.findById(req.params.id).populate({
      path: 'comments',
      populate: { path: 'replies' }
    });

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.render('sl-product', { product }); // Render the product.ejs page with the product data and comments
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}else {
  res.redirect('/auth/login');
}
});
 router.get('/product/Sustainable_Fashion/:id', async (req, res) => {
  if (req.session.user) {
  try {
    
    const product = await items.findById(req.params.id).populate({
      path: 'comments',
      populate: { path: 'replies' }
    });

    if (!product) {
      return res.status(404).send('Product not found');
    }

    res.render('sf-product', { product }); // Render the product.ejs page with the product data and comments
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}else {
  res.redirect('/auth/login');
}
});
// Route to handle comment submission

router.post('/api/commentss', async (req, res) => {
  try {
    const { productId, comment } = req.body;
    console.log(req.session.user); // Log session data for debugging
    const userEmail = req.session.user.email;
    const userName = req.session.user.username || ''; // Provide a default value if name is not available

    if (!userEmail || !userName) {
      return res.status(400).json({ error: 'User email and name are required' });
    }

    const newComment = new ProductComment({
      productId,
      userEmail,
      userName,
      comment
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// GET comments for a product
router.get('/api/commentss', async (req, res) => {
  try {
    const { productId } = req.query;
    const comments = await ProductComment.find({ productId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;

