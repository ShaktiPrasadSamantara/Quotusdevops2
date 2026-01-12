const mongoose = require('mongoose');

const awarenessSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['policy', 'helpline', 'tip'],
      default: 'tip',
    },
    link: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Awareness', awarenessSchema);
