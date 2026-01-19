const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/incidents', require('./src/routes/incidentRoutes'));
// app.use('/api/awareness', require('./routes/awarenessRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Sentra API is running' });
});

// Global error handler (should be last)
app.use((err, req, res, next) => {
  console.error('Global error handler triggered:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Common cases – you can extend this
  if (message.includes('already exists')) {
    statusCode = 409; // Conflict
  } else if (message.includes('provide') || message.includes('Invalid')) {
    statusCode = 400;
  } else if (message.includes('not found')) {
    statusCode = 404;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});