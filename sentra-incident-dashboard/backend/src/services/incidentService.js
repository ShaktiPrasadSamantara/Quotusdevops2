const incidentRepository = require('../daos/incidentRepository');
const { generateReferenceId } = require('../utils/incidentUtils');
const path = require('path');

class IncidentService {
  /**
   * Create a new incident report with file uploads
   * @param {Object} user - Authenticated user from middleware
   * @param {Object} data - Request body
   * @param {Array} files - Uploaded files
   */
  async createIncident(user, data, files) {
    const {
      title,
      description,
      type, // Add this line
      category,
      location,
      incidentDate,
      isAnonymous = false,
      priority = 'Medium',
      fileComments = [],
    } = data;

    if (!title || !description || !type || !category) {
      throw new Error('Title, description, type, and category are required'); // Update error message
    }

    // Parse category if it's a string
    let categoryArray = category;
    if (typeof category === 'string') {
      try {
        categoryArray = JSON.parse(category);
      } catch (e) {
        categoryArray = category.split(',').map(c => c.trim());
      }
    }

    // Process uploaded files
    const attachments = files ? files.map((file, index) => ({
      fileName: file.originalname,
      filePath: file.path,
      fileUrl: `/api/uploads/${path.basename(file.path)}`,
      fileSize: file.size,
      fileType: file.mimetype,
      comment: fileComments[index] || '',
      uploadedAt: new Date()
    })) : [];

    const incident = await incidentRepository.create({
      referenceId: generateReferenceId(),
      title,
      description,
      type, // Add this line
      category: categoryArray,
      location,
      incidentDate: incidentDate ? new Date(incidentDate) : new Date(),
      isAnonymous: !!isAnonymous,
      reporter: isAnonymous ? null : user._id,
      priority,
      attachments,
      status: 'Pending',
      history: [
        {
          status: 'Pending',
          changedBy: user._id,
          note: 'Incident created' + (attachments.length > 0 ? ` with ${attachments.length} attachment(s)` : ''),
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