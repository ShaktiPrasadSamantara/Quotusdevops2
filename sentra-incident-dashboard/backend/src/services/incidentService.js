const incidentRepository = require('../daos/incidentRepository');
const { generateReferenceId } = require('../utils/incidentUtils'); // we'll create this

class IncidentService {
  async createIncident(user, data) {
    const {
      title, description, category, location, incidentDate,
      isAnonymous = false, priority = 'Medium'
    } = data;

    if (!title || !description || !category) {
      throw new Error('Title, description and category are required');
    }

    const incident = await incidentRepository.create({
      referenceId: generateReferenceId(),
      title,
      description,
      category,
      location,
      incidentDate,
      isAnonymous: !!isAnonymous,
      reporter: isAnonymous ? null : user._id,
      priority,
      status: 'Pending',
      history: [{
        status: 'Pending',
        changedBy: user._id,
        note: 'Incident created'
      }]
    });

    return incident;
  }

  async getMyIncidents(userId) {
    return await incidentRepository.findByReporter(userId);
  }

  async getAllIncidents(filters = {}) {
    return await incidentRepository.findAllWithFilters(filters);
  }

  async getIncidentById(id, user) {
    const incident = await incidentRepository.findById(id, ['reporter', 'assignedTo']);

    if (!incident) {
      throw new Error('Incident not found');
    }

    // Authorization check for students
    if (user.role === 'student' && !incident.isAnonymous &&
        incident.reporter?._id?.toString() !== user._id.toString()) {
      throw new Error('You are not authorized to view this incident');
    }

    return incident;
  }

  async updateStatus(incidentId, userId, { status, note = '' }) {
    if (!status) throw new Error('Status is required');

    const historyEntry = {
      status,
      changedBy: userId,
      note
    };

    const updated = await incidentRepository.updateStatus(incidentId, status, historyEntry);

    if (!updated) throw new Error('Incident not found');

    return updated;
  }

  async assignIncident(incidentId, userId, { assignedTo }) {
    if (!assignedTo) throw new Error('assignedTo user ID is required');

    const historyEntry = {
      status: 'Pending', // or keep current status
      changedBy: userId,
      note: 'Assigned to staff'
    };

    const updated = await incidentRepository.assignTo(incidentId, assignedTo, historyEntry);

    if (!updated) throw new Error('Incident not found');

    return updated;
  }
}

module.exports = new IncidentService();