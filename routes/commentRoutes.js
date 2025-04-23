const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Comment = require('../models/Comment');

// Add Comment
router.post('/tasks/:taskId/comments', auth, async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      taskId: req.params.taskId,
      userId: req.userId
    });
    
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get Comments for Task
router.get('/tasks/:taskId/comments', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
      
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;