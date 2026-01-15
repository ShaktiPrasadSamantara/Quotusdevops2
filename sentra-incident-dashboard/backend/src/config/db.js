const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // These options are usually no longer needed in Mongoose ≥ 6.x / 7.x
      // but safe to keep for older versions or Atlas
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Important: exit process so you know immediately something is wrong
    process.exit(1);
  }
};

module.exports = connectDB;