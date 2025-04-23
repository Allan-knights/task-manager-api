const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Task = require('../models/Task');

// Get User's Tasks
router.get('/users/:userId/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedUserId: req.params.userId })
      .populate('projectId', 'name')
      .sort({ dueDate: 1 });
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;