const express = require('express');
const router = express.Router();

const {
  createIncident,
  getMyIncidents,
  getAllIncidents,
  getIncident,
  updateIncidentStatus,
  assignIncident,
} = require('../controllers/incidentController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Student / Staff: create incident
router.post('/', protect, createIncident);

// Student / Staff: view own incidents
router.get('/my', protect, getMyIncidents);

// Staff / Admin: list all with filters
router.get('/', protect, authorize('staff', 'admin'), getAllIncidents);

// View single incident (role-aware)
router.get('/:id', protect, getIncident);

// Staff / Admin: change status
router.patch('/:id/status', protect, authorize('staff', 'admin'), updateIncidentStatus);

// Admin only: assign to staff
router.patch('/:id/assign', protect, authorize('admin'), assignIncident);

module.exports = router;