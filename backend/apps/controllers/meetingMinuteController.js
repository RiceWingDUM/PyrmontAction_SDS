const MeetingMinute = require('../models/meetingMinuteModel');

module.exports = {
  // Upload new file
  // async uploadMinutes(req, res) {
  //   try {
  //     const { title, meetingDate } = req.body;
  //     if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  //     const minutes = await MeetingMinute.create({
  //       title,
  //       meetingDate,
  //       fileUrl: req.file.path,
  //     });

  //     res.status(201).json(minutes);
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
  // },
  async createMeeting(req, res) {
    try {
      req.body.fileUrl = "/uploads/";
      const minutes = new MeetingMinute(req.body);
      await minutes.save();
      res.status(201).json(minutes);
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
      const updatedMeeting = await MeetingMinute.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedMeeting) return res.status(404).json({ message: 'Not found' });
      res.json(updatedMinute);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

};
