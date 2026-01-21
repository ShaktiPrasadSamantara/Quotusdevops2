const userRepository = require('../daos/userRepository');
const generateToken = require('../utils/generateToken');

class AuthService {
  async register({ name, email, password, role }) {
    if (!name || !email || !password) {
      throw new Error('Please provide name, email and password');
    }

    const exists = await userRepository.existsByEmail(email);
    if (exists) {
      throw new Error('User with this email already exists');
    }

    const user = await userRepository.create({
      name,
      email,
      password,           // will be hashed by mongoose pre-save hook
      role: role || 'student',
    });

    return this._formatUserWithToken(user);
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new Error('Please provide email and password');
    }

    const user = await userRepository.findByEmail(email, true);
    if (!user || !(await user.matchPassword(password))) {
      throw new Error('Invalid email or password');
    }

    return this._formatUserWithToken(user);
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID to update
   * @param {Object} updateData - Data to update (name, email)
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, updateData) {
    const { name, email } = updateData;

    // Check if user exists
    const existingUser = await userRepository.findById(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // If email is being changed, check if new email already exists
    if (email && email !== existingUser.email) {
      const emailExists = await userRepository.existsByEmail(email, userId);
      if (emailExists) {
        throw new Error('Email already in use');
      }
    }

    // Prepare update data
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;

    // Update user
    const updatedUser = await userRepository.updateById(userId, updateFields);
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return updatedUser;
  }

  /**
   * Delete user by ID
   * @param {string} userId - User ID to delete
   * @returns {Promise<Object>} Deletion result
   */
  async deleteUser(userId) {
    // Check if user exists
    const existingUser = await userRepository.findById(userId);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Prevent self-deletion (admin can't delete themselves)
    // You can add this check if needed
    // if (userId === currentUserId) {
    //   throw new Error('Cannot delete your own account');
    // }

    // Delete user
    const result = await userRepository.deleteById(userId);
    if (!result) {
      throw new Error('Failed to delete user');
    }

    return { message: 'User deleted successfully' };
  }

  // Helper - formats response (same for register & login)
  _formatUserWithToken(user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };
  }
}

module.exports = new AuthService();