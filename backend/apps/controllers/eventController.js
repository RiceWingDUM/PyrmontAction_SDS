const Event = require('../models/eventModel');

// Create event with optional file upload
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, startDate, endDate, status } = req.body;
    
    // Create event data
    const eventData = {
      title,
      description,
      location,
      startDate,
      endDate,
      status: status || 'draft',
      createdBy: req.user?.id || 'Unknown'
    };

    // If file was uploaded, process it
    if (req.file) {
      // Add file info to event
      eventData.imageUrl = `/uploads/events/${req.file.filename}`;
      eventData.originalFileName = req.file.originalname;
      eventData.fileType = 'uploaded';
    }

    const event = new Event(eventData);
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Upload file to existing event
exports.uploadEventFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const eventId = req.params.id;
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update event with file info
    event.imageUrl = `/uploads/events/${req.file.filename}`;
    event.originalFileName = req.file.originalname;
    event.fileType = 'uploaded';

    await event.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      event: event
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read (public)
exports.getPublishedEvents = async (_req, res) => {
  const events = await Event.find({ status: 'published' });
  res.json(events);
};

// Update
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
