const mongoose = require('mongoose');

const statusEnum = ['Pending', 'In Review', 'Resolved'];
const priorityEnum = ['Low', 'Medium', 'High', 'Critical'];
// Add type enum based on your frontend options
const typeEnum = ['New Request', 'Bug Fixing', 'Update Request'];

const historySchema = new mongoose.Schema(
  {
    status: { type: String, enum: statusEnum, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const attachmentSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, required: true },
    fileType: { type: String, required: true },
    comment: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const incidentSchema = new mongoose.Schema(
  {
    referenceId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: typeEnum }, // Add this line
    category: { type: [String], required: true },
    location: String,
    incidentDate: Date,
    isAnonymous: { type: Boolean, default: false },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: statusEnum, default: 'Pending' },
    priority: { type: String, enum: priorityEnum, default: 'Medium' },
    attachments: [attachmentSchema],
    history: [historySchema],
  },
  { timestamps: true }
);

// Optional: better JSON output
incidentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Incident', incidentSchema);