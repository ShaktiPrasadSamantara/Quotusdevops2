const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware'); // ← use authorize if you have it
const User = require('../models/User'); // ← direct import for simplicity
const userRepository = require('../daos/userRepository');

// GET /api/auth/staff - Admin only - List all staff users
router.get(
  '/staff',
  protect,
  authorize('admin'), // ← recommended: use your existing authorize middleware
  async (req, res, next) => {
    try {
        
      const staff = await User.find({ role: 'staff' })
        .select('_id name email role')
        .sort({ name: 1 })
        .lean(); // faster, returns plain objects

      res.json(staff);
    } catch (error) {
      console.error('Error fetching staff users:', error);
      next(error);
    }
  }
);


router.get('/students', protect, authorize('admin'), async (req, res, next) => {
  try {
    const students = await userRepository.findByRole('student');
    res.json(students);
  } catch (error) {
    console.error('Error fetching student users:', error);
    next(error);
  }
});

router.get('/debug-test', (req, res) => {
  res.json({ 
    message: 'This route is working!',
    time: new Date().toISOString(),
    file: __filename 
  });
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);


module.exports = router;