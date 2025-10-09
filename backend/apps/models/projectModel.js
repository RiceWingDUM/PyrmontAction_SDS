const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  project_description: { type: String, required: true },
  project_type: { type: String, enum: ['open', 'closed'], default: 'open' },
  project_image: { type: String, required: true }, // Can be filename or uploaded file URL
  project_image_type: { 
    type: String, 
    enum: ['static', 'uploaded'], 
    default: 'static' 
  }, // Indicates if image is static asset or uploaded file
  uploaded_file_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UploadedFile',
    required: false 
  }, // Reference to uploaded file if applicable
  project_date: { type: Date, default: Date.now }
}, { timestamps: true });



const Project = mongoose.model('Project', projectSchema);
module.exports = Project
