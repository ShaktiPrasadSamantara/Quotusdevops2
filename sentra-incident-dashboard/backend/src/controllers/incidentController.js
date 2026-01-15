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

const getIncidents = async (req, res, next) => {
  try {
    const incidents = await incidentService.getIncidentsForUser(req.user);

    // Clean up for frontend: convert populated fields to more usable format
    const cleaned = incidents.map((i) => {
      const obj = i.toObject();
      return {
        ...obj,
        reporter: i.reporter
          ? { ...i.reporter.toObject(), _id: i.reporter._id.toString() }
          : null,
        assignedTo: i.assignedTo
          ? { ...i.assignedTo.toObject(), _id: i.assignedTo._id.toString() }
          : null,
      };
    });

    res.json(cleaned);
  } catch (error) {
    next(error);
  }
};

const getIncidentById = async (req, res, next) => {
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
  getIncidents,          // ← this is the main list endpoint now
  getIncidentById,
  updateIncidentStatus,
  assignIncident,
};