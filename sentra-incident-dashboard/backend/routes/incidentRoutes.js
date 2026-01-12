const express = require('express');
const Incident = require('../models/Incident');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

const generateReferenceId = () => {
  return 'SENTRA-' + Date.now().toString(36).toUpperCase();
};

// Create incident (student/staff)
router.post('/', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      incidentDate,
      isAnonymous,
      priority,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const incident = await Incident.create({
      referenceId: generateReferenceId(),
      title,
      description,
      category,
      location,
      incidentDate,
      isAnonymous: !!isAnonymous,
      reporter: isAnonymous ? null : req.user._id,
      priority: priority || 'Medium',
      status: 'Pending',
      history: [
        {
          status: 'Pending',
          changedBy: req.user._id,
          note: 'Incident created',
        },
      ],
    });

    return res.status(201).json(incident);
  } catch (error) {
    console.error('Create incident error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get current user's incidents (student/staff)
router.get('/my', protect, async (req, res) => {
  try {
    const query = {
      $or: [
        { reporter: req.user._id },
        { isAnonymous: true }, // still show if needed
      ],
    };

    const incidents = await Incident.find(query)
      .sort({ createdAt: -1 })
      .select('-history');

    return res.json(incidents);
  } catch (error) {
    console.error('Get my incidents error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin/staff: get all incidents with filters
router.get('/', protect, authorizeRoles('staff', 'admin'), async (req, res) => {
  try {
    const { status, category, priority } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const incidents = await Incident.find(filter)
      .sort({ createdAt: -1 });

    // Map incidents to ensure reporter and assignedTo are strings or null
    const response = incidents.map((incident) => {
      const obj = incident.toObject();
      return {
        ...obj,
        reporter: obj.reporter ? obj.reporter.toString() : null,
        assignedTo: obj.assignedTo ? obj.assignedTo.toString() : null,
      };
    });

    return res.json(response);

  } catch (error) {
    console.error('Get all incidents error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get single incident (role-based)
router.get('/:id', protect, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('reporter', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    // If student/staff and not admin/staff, allow only if reporter or anonymous
    if (
      req.user.role === 'student' &&
      !incident.isAnonymous &&
      incident.reporter &&
      incident.reporter._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: 'You cannot view this incident' });
    }

    return res.json(incident);
  } catch (error) {
    console.error('Get incident error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update status (staff/admin)
router.patch(
  '/:id/status',
  protect,
  authorizeRoles('staff', 'admin'),
  async (req, res) => {
    try {
      const { status, note } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const incident = await Incident.findById(req.params.id);
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }

      incident.status = status;
      incident.history.push({
        status,
        changedBy: req.user._id,
        note: note || '',
      });

      await incident.save();
      return res.json(incident);
    } catch (error) {
      console.error('Update status error:', error.message);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// Assign incident (admin)
router.patch(
  '/:id/assign',
  protect,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { assignedTo } = req.body;

      if (!assignedTo) {
        return res.status(400).json({ message: 'assignedTo is required' });
      }

      const incident = await Incident.findById(req.params.id);
      if (!incident) {
        return res.status(404).json({ message: 'Incident not found' });
      }

      incident.assignedTo = assignedTo;
      incident.history.push({
        status: incident.status,
        changedBy: req.user._id,
        note: 'Assigned to staff',
      });

      await incident.save();
      return res.json(incident);
    } catch (error) {
      console.error('Assign incident error:', error.message);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
