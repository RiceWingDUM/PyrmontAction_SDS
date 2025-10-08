const MeetingMinute = require('../models/meetingMinuteModel');

module.exports = {
  // Upload new file
  async uploadMinutes(req, res) {
    try {
      const { title, meetingDate } = req.body;
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

      const minutes = await MeetingMinute.create({
        title,
        meetingDate,
        fileUrl: req.file.path,
      });

      res.status(201).json(minutes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // List public
  async listPublic(_req, res) {
    const minutes = await MeetingMinute.find({ status: 'published' }).sort({ meetingDate: -1 });
    res.json(minutes);
  },

  // Publish
  async publishMinutes(req, res) {
    const minutes = await MeetingMinute.findByIdAndUpdate(
      req.params.id,
      { status: 'published' },
      { new: true }
    );
    if (!minutes) return res.status(404).json({ message: 'Not found' });
    res.json(minutes);
  },
};
