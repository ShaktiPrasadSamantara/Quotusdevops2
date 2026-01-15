const mongoose = require('mongoose');

const statusEnum = ['Pending', 'In Review', 'Resolved'];
const priorityEnum = ['Low', 'Medium', 'High', 'Critical'];

const historySchema = new mongoose.Schema(
  {
    status: { type: String, enum: statusEnum, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const incidentSchema = new mongoose.Schema(
  {
    referenceId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: String,
    incidentDate: Date,
    isAnonymous: { type: Boolean, default: false },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: statusEnum, default: 'Pending' },
    priority: { type: String, enum: priorityEnum, default: 'Medium' },
    attachments: [{ fileName: String, fileUrl: String }],
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