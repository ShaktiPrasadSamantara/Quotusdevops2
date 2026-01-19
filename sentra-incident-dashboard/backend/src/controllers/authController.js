const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const userData = await authService.register(req.body);
    res.status(201).json(userData);
  } catch (error) {
    next(error);   // ← forward to global error handler
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

module.exports = {
  register,
  login,
  getMe,
};