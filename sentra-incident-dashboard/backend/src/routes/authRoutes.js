const express = require('express');
const router = express.Router();

const { 
  register, 
  login, 
  getMe, 
  updateUser,
  deleteUser // Add this import
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Admin only routes
router.get(
  '/staff',
  protect,
  authorize('admin'),
  async (req, res, next) => {
    try {
      const User = require('../models/User');
      const staff = await User.find({ role: 'staff' })
        .select('_id name email role')
        .sort({ name: 1 })
        .lean();

      res.json(staff);
    } catch (error) {
      console.error('Error fetching staff users:', error);
      next(error);
    }
  }
);

router.get(
  '/students',
  protect,
  authorize('admin'),
  async (req, res, next) => {
    try {
      const User = require('../models/User');
      const students = await User.find({ role: 'student' })
        .select('_id name email role')
        .sort({ name: 1 })
        .lean();

      res.json(students);
    } catch (error) {
      console.error('Error fetching student users:', error);
      next(error);
    }
  }
);

// Update user route
router.put(
  '/users/:id',
  protect,
  async (req, res, next) => {
    try {
      const User = require('../models/User');
      const userId = req.params.id;
      const { name, email } = req.body;

      // Validate input
      if (!name && !email) {
        return res.status(400).json({
          success: false,
          message: 'Please provide name or email to update',
        });
      }

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Check authorization (admin or own profile)
      if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this user',
        });
      }

      // Check if email already exists (if email is being updated)
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use',
          });
        }
      }

      // Update user
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      res.json({
        success: true,
        message: 'User updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      next(error);
    }
  }
);

// Delete user route
router.delete(
  '/users/:id',
  protect,
  authorize('admin'), // Only admin can delete
  async (req, res, next) => {
    try {
      const User = require('../models/User');
      const userId = req.params.id;

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Prevent self-deletion
      if (req.user._id.toString() === userId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account',
        });
      }

      // Delete user
      await User.findByIdAndDelete(userId);

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      next(error);
    }
  }
);

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Debug route
router.get('/debug-test', (req, res) => {
  res.json({ 
    message: 'This route is working!',
    time: new Date().toISOString(),
    file: __filename 
  });
});

module.exports = router;