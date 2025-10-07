const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  project_description: { type: String, required: true },
  project_type: { type: String, enum: ['open', 'closed'], default: 'open' },
  project_image: { type: String, required: true },
  project_date: { type: Date, default: Date.now }
}, { timestamps: true });



const Project = mongoose.model('Project', projectSchema);
module.exports = Project
