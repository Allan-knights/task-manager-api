require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // Assuming 'auth' middleware is handled in projectRoutes
app.use('/api/tasks', taskRoutes); // Assuming 'auth' middleware is handled in taskRoutes
app.use('/api/comments', commentRoutes); // Assuming 'auth' middleware is handled in commentRoutes
app.use('/api/users', userRoutes); // Assuming 'auth' middleware is handled in userRoutes

// Basic route
app.get('/', (req, res) => {
  res.send('Task Manager API');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});