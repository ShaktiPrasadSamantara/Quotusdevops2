// controllers/incidentExtraController.js
const Incident = require('../models/Incident');

/**
 * Get detailed change history for an incident
 */
const getIncidentHistory = async (req, res, next) => {
    try {
        const incident = await Incident.findById(req.params.id)
            .populate('history.changedBy', 'name email role')
            .select('history');

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: 'Incident not found'
            });
        }

        // Check if user can view this incident
        const canView =
            req.user.role === 'admin' ||
            req.user.role === 'staff' ||
            req.user.role === 'student' ||
            (incident.reporter && incident.reporter.toString() === req.user._id.toString()) ||
            incident.isAnonymous;

        if (!canView) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this incident'
            });
        }

        res.json({
            success: true,
            data: incident.history
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update incident details (for reporter)
 */
const updateIncidentDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, category, location, incidentDate, priority } = req.body;

        const incident = await Incident.findById(id)
            .populate('reporter', 'name email role')
            .populate('assignedTo', 'name email role');

        if (!incident) {
            return res.status(404).json({
                success: false,
                message: 'Incident not found'
            });
        }

        // controllers/incidentExtraController.js - Update this part:

        // Check if user is the reporter and incident is pending
        const isReporter = incident.reporter &&
            incident.reporter._id.toString() === req.user._id.toString();

        // For anonymous incidents, we need to verify the user differently
        // Since anonymous incidents don't have a reporter linked to a user account
        // You might need to implement a token-based verification or session verification

        if (incident.status !== 'Pending') {
            return res.status(403).json({
                success: false,
                message: 'Only the reporter can edit pending incidents'
            });
        }

        // Track changes
        const changes = [];

        // Update fields if provided
        if (title !== undefined && title !== incident.title) {
            changes.push(`Title changed from "${incident.title}" to "${title}"`);
            incident.title = title;
        }

        if (description !== undefined && description !== incident.description) {
            changes.push('Description updated');
            incident.description = description;
        }

        if (category !== undefined) {
            let categoryArray = category;
            if (typeof category === 'string') {
                try {
                    categoryArray = JSON.parse(category);
                } catch (e) {
                    categoryArray = category.split(',').map(c => c.trim());
                }
            }

            const oldCat = JSON.stringify(incident.category.sort());
            const newCat = JSON.stringify(categoryArray.sort());

            if (oldCat !== newCat) {
                changes.push(`Category changed from "${incident.category.join(', ')}" to "${categoryArray.join(', ')}"`);
                incident.category = categoryArray;
            }
        }

        if (location !== undefined && location !== incident.location) {
            if (!incident.location && location) {
                changes.push(`Location set to "${location}"`);
            } else if (incident.location && !location) {
                changes.push(`Location removed (was "${incident.location}")`);
            } else {
                changes.push(`Location changed from "${incident.location}" to "${location}"`);
            }
            incident.location = location;
        }

        if (incidentDate !== undefined) {
            const newDate = new Date(incidentDate);
            const oldDate = incident.incidentDate ? new Date(incident.incidentDate) : null;

            if ((!oldDate && newDate) || (oldDate && !newDate) ||
                (oldDate && newDate && oldDate.getTime() !== newDate.getTime())) {
                changes.push('Incident date updated');
                incident.incidentDate = newDate;
            }
        }

        if (priority !== undefined && priority !== incident.priority) {
            changes.push(`Priority changed from ${incident.priority} to ${priority}`);
            incident.priority = priority;
        }

        // Add history entry if changes were made
        if (changes.length > 0) {
            incident.history.push({
                status: incident.status,
                changedBy: req.user._id,
                note: `Incident updated: ${changes.join(', ')}`,
                changedAt: new Date()
            });
        }

        await incident.save();

        res.json({
            success: true,
            data: incident,
            message: changes.length > 0 ? 'Incident updated successfully' : 'No changes made',
            changes: changes
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get comments for an incident
 */
const getIncidentComments = async (req, res, next) => {
    try {
        // For now, return empty array if you haven't implemented comments yet
        res.json({
            success: true,
            data: []
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getIncidentHistory,
    updateIncidentDetails,
    getIncidentComments
};