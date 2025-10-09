const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String }, // Short description for blog listing
  author: { type: String, required: true },
  featuredImage: { type: String }, // URL or filename for the featured image
  originalFileName: { type: String }, // Store original filename for display
  imageType: { 
    type: String, 
    enum: ['static', 'uploaded'], 
    default: 'static' 
  },
  tags: [{ type: String }], // Array of tags for categorization
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  publishedAt: { type: Date },
  views: { type: Number, default: 0 }, // Track view count
}, { timestamps: true });

// Update publishedAt when status changes to published
blogSchema.pre('save', function(next) {
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;