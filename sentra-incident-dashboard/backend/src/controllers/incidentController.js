const incidentService = require('../services/incidentService');

const createIncident = async (req, res, next) => {
  try {
    // Extract file comments from request body
    const fileComments = Array.isArray(req.body.fileComments) 
      ? req.body.fileComments 
      : req.body.fileComments ? [req.body.fileComments] : [];
    
    const incident = await incidentService.createIncident(
      req.user, 
      req.body, 
      req.files,
      fileComments
    );
    
    res.status(201).json({
      success: true,
      message: 'Incident submitted successfully',
      referenceId: incident.referenceId,
      incidentId: incident._id,
      attachmentsCount: incident.attachments.length
    });
  } catch (error) {
    next(error);
  }
};

const getMyIncidents = async (req, res, next) => {
  try {
    const incidents = await incidentService.getMyIncidents(req.user._id);
    res.json({
      success: true,
      data: incidents,
      count: incidents.length
    });
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

    res.json({
      success: true,
      data: cleaned,
      count: cleaned.length
    });
  } catch (error) {
    next(error);
  }
};

const getIncidentById = async (req, res, next) => {
  try {
    const incident = await incidentService.getIncidentById(req.params.id, req.user);
    res.json({
      success: true,
      data: incident
    });
  } catch (error) {
    next(error);
  }
};

const updateIncidentStatus = async (req, res, next) => {
  try {
    const updated = await incidentService.updateStatus(req.params.id, req.user._id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const assignIncident = async (req, res, next) => {
  try {
    const updated = await incidentService.assignIncident(req.params.id, req.user._id, req.body);
    res.json({
      success: true,
      data: updated,
      message: 'Incident assigned successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIncident,
  getMyIncidents,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
  assignIncident,
};