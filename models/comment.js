const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
