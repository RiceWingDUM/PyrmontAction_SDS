const mongoose = require('mongoose');

const meetingMinuteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  note: { type: String },
  fileUrl: { type: String }, // Optional - can be null if no file uploaded
  filename: { type: String }, // Store original filename for display
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true });

const MeetingMinute = mongoose.model('MeetingMinute', meetingMinuteSchema);
module.exports = MeetingMinute;