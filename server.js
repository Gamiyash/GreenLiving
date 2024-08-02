
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const eventRoutes = require('./routes/event');
const postRoutes = require('./routes/post');
const homeRoutes = require('./routes/home');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const Item = require('./models/item'); 
const Events = require('./models/event');
const items = require('./models/item');
const Echo = require('./models/data');
const Comment = require('./models/comment');
const Order = require('./models/Order'); 
const User = require('./models/User');
const itemRoutes = require('./routes/product');
const Razorpay = require('razorpay');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');
const multer = require('multer');
const crypto = require('crypto');
const EventReg = require('./models/EventReg')
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
db();

// Middleware setup
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/admin', require('./routes/admin'));
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Passport Configuration
require('./config/passport');

// Route setup
app.use('/', indexRoutes);
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/', postRoutes);
app.use('/', eventRoutes);
app.use('/',itemRoutes)
app.use('/',adminRoutes)
app.use('/user', userRoutes); 

// Routes
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/hi', (req, res) => res.send("hello world"));
app.get('/try', (req, res) => res.render('try'));
app.get('/ev', (req, res) => res.render('event'));
app.get('/about', (req, res) => res.render('about',{user: req.session.user}));
app.get('/cart', (req, res) => {
  res.render('cart');
});
app.get('/blog', async(req, res) => {
  try {
    const data = await Echo.find({});

    if (data.length > 0 ) {
      res.render('blogspage', { blogs: data, user: req.session.user });
      console.log({ data });
    } else {
      res.render('blogspage', { blogs: [], user: req.session.user });
      console.log('No data or events found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/event', async(req, res) => {
  try {
    const events = await Events.find({});

    if ( events.length > 0) {
      res.render('eventpage', { events: events, user: req.session.user });
      console.log({ events });
    } else {
      res.render('eventpage', { blogs: [], user: req.session.user });
      console.log('No data or events found');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/shop', async (req, res) => {
  try {
    const items = await Item.find({});
    res.render('shoppage', { items: items, user: req.session.user });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/checkout', async(req, res) => {
  
  res.render('checkout');
});
app.get('/user-profile', async(req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');

    const user = await User.findById(req.session.user._id);
    if (!user) return res.status(404).send('User not found');

    res.render('Profileuser', { user });
    console.log('Profile route accessed');
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Internal Server Error');
  }
});




// ai chat
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// ...

// The Gemini 1.5 models are versatile and work with most use cases
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
app.get('/api/chat', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = req.query.message;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//ai chat 





// Razorpay payment gateway
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post('/checkout', async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user authentication is in place
    const cartItems = req.body.cartItems; // Assuming cart items are sent in the request

    // Create a new order
    const newOrder = new Order({
      user: userId,
      cartItems: cartItems,
      date: new Date(),
      // Add more fields as needed
    });

    // Save the order to the database
    await newOrder.save();

    // Clear cart or handle further logic
    // ...

    res.redirect('/order-history'); // Redirect to the order history page
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/create-order', async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: req.body.amount,
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex')
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(order);
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/verify-payment', async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    if (generatedSignature === signature) {
      // Payment is verified
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false });
  }
});
// app.get('/order-history', (req, res) => {
//   res.render('order-history');

// });
app.get('/order-history', async (req, res) => {
  try {
      const orders = await Order.find().exec();
      res.render('order-history', { orders });
  } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).send('Internal Server Error');
  }
});




// app.post('/save-orders', async (req, res) => {
//   try {
//       const { orders } = req.body;
//       // Process and save orders
//       res.status(200).json({ success: true });
//   } catch (error) {
//       console.error('Error saving orders:', error);
//       res.status(500).json({ success: false });
//   }
// });

app.post('/save-orders', async (req, res) => {
  try {
      const { orders } = req.body;
      console.log('Received orders:', orders);

      // Ensure orders are properly formatted and processed
      if (!Array.isArray(orders) || orders.length === 0) {
          return res.status(400).json({ success: false, message: 'Invalid orders data' });
      }

      // Process and save orders to the database (assuming `Order` is your model)
      // Example:
      await Order.insertMany(orders);

      res.status(200).json({ success: true });
  } catch (error) {
      console.error('Error saving orders:', error);
      res.status(500).json({ success: false });
  }
});

// router.delete('/clear-orders', async (req, res) => {
//   try {
//     const result = await Order.deleteMany({});
//     if (result.deletedCount === 0) {
//         return res.status(404).json({ message: 'No orders found to delete.' });
//     }
//     res.status(200).json({ message: 'All orders cleared successfully.', deletedCount: result.deletedCount });
// } catch (error) {
//     console.error('Error clearing orders:', error);
//     res.status(500).json({ message: 'Error clearing orders.', error });
// }
// });




// Assuming user authentication is handled and userId is available from session or token



// Get user profile

// app.get('/U_Profile', async (req, res) => {
//   try {
//     res.render('U_Profile');
//   } catch (error) {
//     console.error('Error rendering view:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });



app.get('/registration', (req,res )=>{
  res.render('registration')
})
app.post('/api/register', async (req, res) => {
  try {
    const { email, dob, address, phone } = req.body;

    // Create a new EventReg document
    const newRegistration = new EventReg({
      email,
      dob,
      address,
      phone
    });

    // Save the document to the database
    await newRegistration.save();
    console.log("done")
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      // Duplicate key error (email already exists)
      res.status(400).json({ message: 'Email already registered' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});