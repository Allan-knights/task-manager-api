const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');

// Create Project
// Create Task in Project
router.post('/:projectId/tasks', auth, async (req, res) => {
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

// Get All Projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.userId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Project
router.get('/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      createdBy: req.userId
    }).populate('createdBy', 'email');
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Project
router.delete('/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.projectId,
      createdBy: req.userId
    });
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Delete associated tasks
    await Task.deleteMany({ projectId: req.params.projectId });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;