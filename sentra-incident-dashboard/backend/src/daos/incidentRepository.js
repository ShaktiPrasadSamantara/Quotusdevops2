const Incident = require('../models/Incident');

class IncidentRepository {
  async create(incidentData) {
    const incident = new Incident(incidentData);
    return await incident.save();
  }

  async findById(id, populate = []) {
    let query = Incident.findById(id);
    populate.forEach(field => query = query.populate(field));
    return await query.exec();
  }

  async findByReporter(userId) {
    return await Incident.find({
      $or: [
        { reporter: userId },
        { isAnonymous: true }
      ]
    })
      .sort({ createdAt: -1 })
      .select('-history')
      .exec();
  }

  async findAllWithFilters(filters = {}, sort = { createdAt: -1 }) {
    return await Incident.find(filters)
      .sort(sort)
      .populate('reporter', 'name email role')
      .populate('assignedTo', 'name email role')
      .exec();
  }

  async updateStatus(incidentId, status, historyEntry) {
    return await Incident.findByIdAndUpdate(
      incidentId,
      {
        $set: { status },
        $push: { history: historyEntry }
      },
      { new: true, runValidators: true }
    ).exec();
  }

  async assignTo(incidentId, assignedTo, historyEntry) {
    return await Incident.findByIdAndUpdate(
      incidentId,
      {
        $set: { assignedTo },
        $push: { history: historyEntry }
      },
      { new: true, runValidators: true }
    ).exec();
  }

  async existsById(id) {
    return !!(await Incident.countDocuments({ _id: id }));
  }

  // Add later if needed: findByReferenceId, addAttachment, etc.
}

module.exports = new IncidentRepository();