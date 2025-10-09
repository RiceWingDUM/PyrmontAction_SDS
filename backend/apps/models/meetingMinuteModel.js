const mongoose = require('mongoose');

const meetingMinuteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  meetingDate: { type: Date, required: true },
  note: { type: String },
  fileUrl: { type: String }, // Optional - can be null if no file uploaded
  originalFileName: { type: String }, // Store original filename for display
  fileType: { 
    type: String, 
    enum: ['static', 'uploaded'], 
    default: 'uploaded' 
  },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true });

const MeetingMinute = mongoose.model('MeetingMinute', meetingMinuteSchema);
module.exports = MeetingMinute;