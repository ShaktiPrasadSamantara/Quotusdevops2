const User = require('../models/User');

class UserRepository {
  /**
   * Find user by email (with or without password)
   * @param {string} email
   * @param {boolean} includePassword
   * @returns {Promise<User|null>}
   */
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });
    if (includePassword) {
      query.select('+password');
    }
    return await query.exec();
  }

  /**
   * Find user by ID (without password by default)
   * @param {string} id
   * @param {boolean} includePassword
   * @returns {Promise<User|null>}
   */
  async findById(id, includePassword = false) {
    const query = User.findById(id);
    if (!includePassword) {
      query.select('-password');
    } else {
      query.select('+password');
    }
    return await query.exec();
  }

  /**
   * Create a new user
   * @param {Object} userData
   * @returns {Promise<User>}
   */
  async create(userData) {
    return await User.create(userData);
  }

  /**
   * Check if email already exists
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async existsByEmail(email) {
    return !!(await User.exists({ email }));
  }

  // You can add more methods later, e.g.:
  // updateById(id, data), deleteById(id), findAll(), etc.
}

module.exports = new UserRepository();  