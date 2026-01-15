const express = require('express');
const Awareness = require('../models/Awareness');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Public: get all awareness items
router.get('/', async (req, res) => {
  try {
    const items = await Awareness.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (error) {
    console.error('Get awareness error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: create awareness item
router.post(
  '/',
  protect,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { title, content, type, link } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: 'Please provide title and content' });
      }

      const item = await Awareness.create({
        title,
        content,
        type: type || 'tip',
        link,
      });

      return res.status(201).json(item);
    } catch (error) {
      console.error('Create awareness error:', error.message);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// Admin: update awareness item
router.patch(
  '/:id',
  protect,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const item = await Awareness.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      return res.json(item);
    } catch (error) {
      console.error('Update awareness error:', error.message);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// Admin: delete awareness item
router.delete(
  '/:id',
  protect,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const item = await Awareness.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
      return res.json({ message: 'Item deleted' });
    } catch (error) {
      console.error('Delete awareness error:', error.message);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
