const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

const {
  createIncident,
  getMyIncidents,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
  assignIncident,
} = require('../controllers/incidentController');



const {
  getIncidentHistory,
  updateIncidentDetails,
  getIncidentComments
} = require('../controllers/incidentExtraController');


const { protect, authorize } = require('../middleware/authMiddleware');

// Create incident with file uploads
router.post('/', 
  protect,
  upload.array('files', 5), // Accept up to 5 files with field name 'files'
  createIncident
);

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


// Get incident history
router.get('/:id/history', protect, getIncidentHistory);

// Update incident details (for reporter)
router.put('/:id', protect, updateIncidentDetails);

// Get comments (if implemented)
router.get('/:id/comments', protect, getIncidentComments);


module.exports = router;