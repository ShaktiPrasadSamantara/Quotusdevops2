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

  async findByRole(role) {
    return await User.find({ role })
      .select('_id name email role')
      .sort({ name: 1 })
      .exec();
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
   * Update user by ID
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<User|null>}
   */
  async updateById(id, updateData) {
    // Remove password from updateData if present (password updates should be separate)
    const { password, ...safeUpdateData } = updateData;
    
    return await User.findByIdAndUpdate(
      id,
      { $set: safeUpdateData },
      { new: true, runValidators: true }
    ).select('-password');
  }

  /**
   * Delete user by ID
   * @param {string} id
   * @returns {Promise<Object>} Deletion result
   */
  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }

  /**
   * Check if email already exists (excluding current user)
   * @param {string} email
   * @param {string} excludeUserId - User ID to exclude from check
   * @returns {Promise<boolean>}
   */
  async existsByEmail(email, excludeUserId = null) {
    const query = { email };
    if (excludeUserId) {
      query._id = { $ne: excludeUserId };
    }
    return !!(await User.exists(query));
  }
}

module.exports = new UserRepository();