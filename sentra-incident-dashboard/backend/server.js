const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
app.use('/api/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'src/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads directory created:', uploadDir);
}

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

  // Handle multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large. Maximum size is 10MB per file.',
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      error: 'Too many files. Maximum is 5 files per incident.',
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Invalid file upload field.',
    });
  }

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
  console.log(`Uploads directory: ${uploadDir}`);
  console.log(`File upload endpoint: /api/uploads/`);
});