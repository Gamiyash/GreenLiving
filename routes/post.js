const express = require('express');
const router = express.Router();
const Echo = require('../models/data');
const Comment = require('../models/comment');

// router.get('/home', async (req, res) => {
//   if (req.session.user) {
//     try {
//       const data = await Echo.find({});
//       if (data.length > 0) {
//         res.render('index', { blogs: data, user: req.session.user });
//         console.log(data);
//       } else {
//         res.render('index', { blogs: [], user: req.session.user });
//         console.log('No data found');
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   } else {
//     res.redirect('/auth/login');
//   }
// });

router.get('/post/:id', async (req, res) => {
  if (req.session.user) {
    try {
      const post = await Echo.findById(req.params.id);
      if (post) {
        // Fetch comments for the post
        const comments = await Comment.find({ postId: post._id }).sort({ createdAt: -1 });

        res.render('postpage', { post: post, user: req.session.user, comments: comments });
        console.log(post);
      } else {
        res.status(404).render('postpage', { post: null, user: req.session.user, comments: [] });
        console.log('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post and comments:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.redirect('/auth/login');
  }
});

router.post('/api/comments', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'You must be logged in to comment' });
  }

  try {
    const { comment, postId } = req.body;
    const newComment = new Comment({
      comment,
      postId,
      userEmail: req.session.user.email ,
      userName: req.session.user.username 
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// router.get('/:postId', async (req, res) => {
//   try {
//     const comments = await Comment.find({ postId: req.params.postId }).sort('-createdAt');
//     res.json(comments);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

module.exports = router;
