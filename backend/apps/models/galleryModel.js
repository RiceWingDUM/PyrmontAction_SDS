const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  image_file_name: { type: String, required: true }, // Filename or uploaded file URL
  image_type: { 
    type: String, 
    enum: ['static', 'uploaded'], 
    default: 'static' 
  }, // Indicates if image is static asset or uploaded file
  uploaded_file_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UploadedFile',
    required: false 
  }, // Reference to uploaded file if applicable
  caption: { type: String },
  alt: { type: String }
}, { timestamps: true });

const Gallery = mongoose.model('GalleryImage', galleryImageSchema);
module.exports = Gallery;