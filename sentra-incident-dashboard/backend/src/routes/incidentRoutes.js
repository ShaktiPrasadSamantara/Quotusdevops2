const express = require('express');
const router = express.Router();

const {
  createIncident,
  getMyIncidents,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
  assignIncident,
} = require('../controllers/incidentController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Create incident (authenticated users: student/staff)
router.post('/', protect, createIncident);

// Get own reported incidents (student/staff)
router.get('/my', protect, getMyIncidents);

// Get incidents based on role (admin sees all, staff sees assigned)
router.get('/', protect, authorize('staff', 'admin'), getIncidents);

// Get single incident (with role-based visibility check)
router.get('/:id', protect, getIncidentById);

// Update status (staff + admin)
router.patch('/:id/status', protect, authorize('staff', 'admin'), updateIncidentStatus);

// Assign to staff (admin only)
router.patch('/:id/assign', protect, authorize('admin'), assignIncident);

module.exports = router;