const mongoose = require('mongoose');

const uploadedFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  relativePath: { type: String, required: true }, // Path relative to uploads directory
  url: { type: String, required: true }, // Public URL for serving
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['images', 'pdfs', 'documents', 'gallery', 'projects', 'meeting-minutes', 'general']
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  associatedModel: { type: String }, // Model name (Project, Gallery, etc.)
  associatedId: { type: mongoose.Schema.Types.ObjectId }, // ID of associated document
  tags: [{ type: String }], // Optional tags for organization
  isActive: { type: Boolean, default: true }, // For soft deletion
  description: { type: String }, // Optional description
}, { timestamps: true });

// Index for efficient queries
uploadedFileSchema.index({ category: 1, uploadedBy: 1 });
uploadedFileSchema.index({ associatedModel: 1, associatedId: 1 });
uploadedFileSchema.index({ isActive: 1, createdAt: -1 });

// Virtual for file extension
uploadedFileSchema.virtual('extension').get(function() {
  return this.originalName.split('.').pop().toLowerCase();
});

// Static method to find files by category
uploadedFileSchema.statics.findByCategory = function(category, isActive = true) {
  return this.find({ category, isActive }).sort({ createdAt: -1 });
};

// Static method to find files by user
uploadedFileSchema.statics.findByUser = function(userId, isActive = true) {
  return this.find({ uploadedBy: userId, isActive }).sort({ createdAt: -1 });
};

// Instance method to soft delete
uploadedFileSchema.methods.softDelete = function() {
  this.isActive = false;
  return this.save();
};

const UploadedFile = mongoose.model('UploadedFile', uploadedFileSchema);
module.exports = UploadedFile;