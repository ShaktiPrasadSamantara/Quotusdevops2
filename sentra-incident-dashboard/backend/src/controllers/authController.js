const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const userData = await authService.register(req.body);
    res.status(201).json(userData);
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || 'Registration failed'
  })}
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

module.exports = {
  register,
  login,
  getMe,
};