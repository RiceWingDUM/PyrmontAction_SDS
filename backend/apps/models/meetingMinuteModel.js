const mongoose = require('mongoose');

const meetingMinuteSchema = new mongoose.Schema({

        title: { type: String, required: true },
        note: {type: String },
        fileUrl: { type: String, required: true },
        status: { type: String, enum: ['draft', 'published'], default: 'draft' },

}, { timestamps: true });

const MeetingMinute = mongoose.model('MeetingMinute', meetingMinuteSchema);
module.exports = MeetingMinute;