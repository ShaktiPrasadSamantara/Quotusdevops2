const incidentRepository = require('../daos/incidentRepository'); // ← note: you had '../daos/' before — use consistent path
const { generateReferenceId } = require('../utils/incidentUtils');

class IncidentService {
  /**
   * Create a new incident report
   * @param {Object} user - Authenticated user from middleware
   * @param {Object} data - Request body
   */
  async createIncident(user, data) {
    const {
      title,
      description,
      category,
      location,
      incidentDate,
      isAnonymous = false,
      priority = 'Medium',
    } = data;

    if (!title || !description || !category) {
      throw new Error('Title, description, and category are required');
    }

    const incident = await incidentRepository.create({
      referenceId: generateReferenceId(),
      title,
      description,
      category,
      location,
      incidentDate: incidentDate ? new Date(incidentDate) : undefined,
      isAnonymous: !!isAnonymous,
      reporter: isAnonymous ? null : user._id,
      priority,
      status: 'Pending',
      history: [
        {
          status: 'Pending',
          changedBy: user._id,
          note: 'Incident created',
        },
      ],
    });

    return incident;
  }

  /**
   * Get incidents reported by the current user (for students/staff)
   */
  async getMyIncidents(userId) {
    return await incidentRepository.findByReporter(userId);
  }

  /**
   * Get incidents visible to the current user based on role
   * - Admin: sees everything
   * - Staff: sees only incidents assigned to them
   */
  async getIncidentsForUser(user) {
    console.log(`[DEBUG] User role: ${user.role}, ID: ${user._id.toString()}`);

    if (user.role === 'admin') {
      console.log('[DEBUG] Admin: Fetching all incidents');
      const all = await incidentRepository.findAllWithFilters({});
      console.log(`[DEBUG] Found ${all.length} incidents for admin`);
      return all;
    }

    if (user.role === 'staff') {
      console.log('[DEBUG] Staff: Fetching assigned incidents');
      const assigned = await incidentRepository.findByAssignedTo(user._id);
      console.log(`[DEBUG] Found ${assigned.length} assigned incidents for staff`);

      if (assigned.length > 0) {
        console.log('[DEBUG] First assigned incident ID:', assigned[0]._id.toString());
        console.log('[DEBUG] Its assignedTo:', assigned[0].assignedTo?._id?.toString());
      }

      return assigned;
    }

    throw new Error('Unauthorized: This endpoint is for admin or staff only');
  }

  /**
   * Get single incident with role-based authorization
   */
  async getIncidentById(id, user) {
    const incident = await incidentRepository.findById(id, ['reporter', 'assignedTo']);

    if (!incident) {
      throw new Error('Incident not found');
    }

    // Students can only see their own or anonymous incidents
    if (
      user.role === 'student' &&
      !incident.isAnonymous &&
      incident.reporter?._id?.toString() !== user._id.toString()
    ) {
      throw new Error('You are not authorized to view this incident');
    }

    return incident;
  }

  /**
   * Update incident status (staff/admin)
   */
  async updateStatus(incidentId, userId, { status, note = '' }) {
    if (!status) {
      throw new Error('Status is required');
    }

    const historyEntry = {
      status,
      changedBy: userId,
      note: note.trim() || 'Status updated',
    };

    const updated = await incidentRepository.updateStatus(incidentId, status, historyEntry);

    if (!updated) {
      throw new Error('Incident not found or could not be updated');
    }

    return updated;
  }

  /**
   * Assign incident to a staff member (admin only)
   */
  async assignIncident(incidentId, userId, { assignedTo }) {
  if (!assignedTo) {
    throw new Error('assignedTo (staff user ID) is required');
  }

  console.log(`[ASSIGN] Assigning incident ${incidentId} to user ID: ${assignedTo}`);

  const historyEntry = {
    status: 'Pending',
    changedBy: userId,
    note: 'Incident assigned to staff member',
  };

  const updated = await incidentRepository.assignTo(incidentId, assignedTo, historyEntry);

  if (!updated) {
    throw new Error('Incident not found or could not be assigned');
  }

  console.log(`[ASSIGN SUCCESS] AssignedTo now: ${updated.assignedTo?.toString()}`);

  return updated;
}
}
module.exports = new IncidentService();