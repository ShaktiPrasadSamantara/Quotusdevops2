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