const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Task = require('../models/Task');

// Create Task (within a project)
router.post('/projects/:projectId/tasks', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      projectId: req.params.projectId,
      assignedUserId: req.body.assignedUserId || req.userId
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('projectId', 'name')
      .populate('assignedUserId', 'email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Task
router.put('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Task
router.delete('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Assign/Reassign Task
router.post('/:taskId/assign', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { assignedUserId: req.body.userId },
      { new: true }
    );
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Task Status
router.post('/:taskId/status', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status: req.body.status },
      { new: true }
    );
    
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;