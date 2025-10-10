const MeetingMinute = require('../models/meetingMinuteModel');

module.exports = {
  // Create meeting minute with optional file upload
  async createMeeting(req, res) {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    try {
      const { title, note, status } = req.body;
      

      const meetingData = { title, note, status };

      // If file was uploaded, process it
      if (req.file) {
        // Add file info to meeting minute
        meetingData.fileUrl = `/uploads/meeting-minutes/${req.file.filename}`;
        meetingData.filename = req.file.originalname;
      }

      const minutes = new MeetingMinute(meetingData);
      await minutes.save();

      res.status(201).json(minutes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Upload file to existing meeting minute
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const meetingId = req.params.id;
      const meeting = await MeetingMinute.findById(meetingId);
      
      if (!meeting) {
        return res.status(404).json({ message: 'Meeting minute not found' });
      }

      // Update meeting minute with file info
      meeting.fileUrl = `/uploads/meeting-minutes/${req.file.filename}`;
      meeting.originalFileName = req.file.originalname;
      meeting.fileType = 'uploaded';

      await meeting.save();

      res.status(200).json({
        message: 'File uploaded successfully',
        meeting: meeting
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // List published
  async getPublishedMeeting(_req, res) {
    const publishedMinutes = await MeetingMinute.find({ status: 'published' }).sort({ meetingDate: -1 });
    res.json(publishedMinutes);
  },

  // List all
  async getAllMeetings(_req, res) {
    const allMinutes = await MeetingMinute.find().sort({ meetingDate: -1 });
    res.json(allMinutes);
  },

  // Publish
  async publishMeeting(req, res) {
    const meeting = await MeetingMinute.findByIdAndUpdate(
      req.params.id,
      { status: 'published' },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ message: 'Not found' });
    res.json(meeting);
  },

  // Update an existing meeting minute
  async updateMeeting(req, res) {
    try {
      console.log('Update request body:', req.body);
      const updatedMeeting = await MeetingMinute.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      
      console.log('Updated meeting:', updatedMeeting);
      if (!updatedMeeting) return res.status(404).json({ message: 'Not found' });
      res.json(updatedMeeting);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  
  async deleteMeeting(req, res) {
    try {
      const deletedMeeting = await MeetingMinute.findByIdAndDelete(req.params.id);
      if (!deletedMeeting) return res.status(404).json({ message: 'Meeting not found' });
      res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
