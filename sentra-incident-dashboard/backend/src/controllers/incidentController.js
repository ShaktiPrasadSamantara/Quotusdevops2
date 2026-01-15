const incidentService = require('../services/incidentService');

const createIncident = async (req, res, next) => {
  try {
    const incident = await incidentService.createIncident(req.user, req.body);
    res.status(201).json(incident);
  } catch (error) {
    next(error);
  }
};

const getMyIncidents = async (req, res, next) => {
  try {
    const incidents = await incidentService.getMyIncidents(req.user._id);
    res.json(incidents);
  } catch (error) {
    next(error);
  }
};

const getAllIncidents = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;
    if (priority) filters.priority = priority;

    const incidents = await incidentService.getAllIncidents(filters);

    // Optional: clean ObjectId → string if frontend expects it
    const cleaned = incidents.map(i => ({
      ...i.toObject(),
      reporter: i.reporter?._id?.toString() || null,
      assignedTo: i.assignedTo?._id?.toString() || null,
    }));

    res.json(cleaned);
  } catch (error) {
    next(error);
  }
};

const getIncident = async (req, res, next) => {
  try {
    const incident = await incidentService.getIncidentById(req.params.id, req.user);
    res.json(incident);
  } catch (error) {
    next(error);
  }
};

const updateIncidentStatus = async (req, res, next) => {
  try {
    const updated = await incidentService.updateStatus(req.params.id, req.user._id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const assignIncident = async (req, res, next) => {
  try {
    const updated = await incidentService.assignIncident(req.params.id, req.user._id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIncident,
  getMyIncidents,
  getAllIncidents,
  getIncident,
  updateIncidentStatus,
  assignIncident,
};