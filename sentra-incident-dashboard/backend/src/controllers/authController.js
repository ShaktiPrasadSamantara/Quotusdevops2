const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const userData = await authService.register(req.body);
    res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const userData = await authService.login(req.body);
    res.json(userData);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * Only admins can update any user, users can update only themselves
 */
const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    
    // Only admin can update any user, otherwise users can only update themselves
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user',
      });
    }

    // Prevent role change for non-admins
    if (updateData.role && req.user.role !== 'admin') {
      delete updateData.role;
    }

    const updatedUser = await authService.updateUser(userId, updateData);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * Only admins can delete users
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    // Only admin can delete users
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete users',
      });
    }

    // Prevent self-deletion
    if (req.user._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    const result = await authService.deleteUser(userId);
    
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateUser,
  deleteUser, // Add this export
};