# File Upload System Implementation

## Overview

This document outlines the comprehensive file upload system implemented for the Pyrmont Action SDS website. The system supports both static assets (existing approach) and dynamic file uploads through the admin interface.

## Architecture

### Backend Components

1. **File Upload Middleware** (`fileUpload.js`)
   - Configures multer for different file types
   - Handles single/multiple image uploads
   - Supports PDF and document uploads
   - Organizes files into categorized directories

2. **File Service** (`fileService.js`)
   - Manages file operations (create, read, delete)
   - Handles file path resolution
   - Provides utility functions for file management

3. **UploadedFile Model** (`uploadedFileModel.js`)
   - Tracks all uploaded files in database
   - Maintains metadata (size, type, upload date, etc.)
   - Supports soft deletion and restoration
   - Links files to other models (Projects, Gallery, etc.)

4. **File Upload Controller** (`fileUploadController.js`)
   - Handles upload endpoints
   - Manages file metadata
   - Provides file listing and management APIs

5. **File Upload Routes** (`fileUploadRoutes.js`)
   - RESTful endpoints for file operations
   - Protected by JWT authentication
   - Role-based access control

### Frontend Components

1. **File Service** (`fileService.js`)
   - Frontend API client for file operations
   - Handles FormData creation
   - Provides validation utilities

2. **Image Resolver** (`imageResolver.js`)
   - Unified image resolution system
   - Handles both static and uploaded images
   - Provides fallback mechanisms

3. **FileManagerAdmin Component** (`FileManagerAdmin.vue`)
   - Complete admin interface for file management
   - Upload, view, edit, delete capabilities
   - Filtering and search functionality

4. **FileUpload Component** (`FileUpload.vue`)
   - Reusable upload component
   - Drag & drop support
   - Progress tracking

## Directory Structure

```
backend/
├── apps/
│   ├── uploads/
│   │   ├── images/          # General images
│   │   ├── pdfs/           # PDF documents
│   │   ├── gallery/        # Gallery images
│   │   ├── projects/       # Project images
│   │   ├── meeting-minutes/ # Meeting minute files
│   │   ├── documents/      # Other documents
│   │   └── temp/           # Temporary files
│   ├── middlewares/
│   │   ├── fileUpload.js   # Multer configuration
│   │   └── upload.js       # Legacy upload middleware
│   ├── services/
│   │   └── fileService.js  # File management utilities
│   ├── models/
│   │   ├── uploadedFileModel.js
│   │   ├── projectModel.js (updated)
│   │   └── galleryModel.js (updated)
│   ├── controllers/
│   │   └── fileUploadController.js
│   └── routes/
│       └── fileUploadRoutes.js
└── server.js (updated with static file serving)

frontend/
├── src/
│   ├── services/
│   │   ├── fileService.js
│   │   └── imageResolver.js
│   ├── components/
│   │   └── FileUpload.vue
│   └── features/
│       └── accountDashboard/
│           └── components/
│               └── admin/
│                   └── FileManagerAdmin.vue
```

## API Endpoints

### File Upload Endpoints
- `POST /api/files/single/image` - Upload single image
- `POST /api/files/single/pdf` - Upload single PDF
- `POST /api/files/multiple/images` - Upload multiple images
- `POST /api/files/multiple/pdfs` - Upload multiple PDFs
- `POST /api/files/project/image` - Upload project image

### File Management Endpoints
- `GET /api/files` - List files with filters
- `GET /api/files/:id` - Get file details
- `PUT /api/files/:id` - Update file metadata
- `DELETE /api/files/:id` - Delete/soft delete file
- `POST /api/files/:id/restore` - Restore soft-deleted file
- `GET /api/files/stats` - Get file statistics

### Static File Serving
- `GET /uploads/*` - Serve uploaded files

## Usage Examples

### Backend Usage

```javascript
// Upload single image
router.post('/upload', 
  jwtAuth.verifyToken,
  jwtAuth.verifyRole(['admin']),
  upload.singleImage,
  async (req, res) => {
    const fileInfo = fileService.processUploadedFile(req.file, 'gallery');
    // Save to database...
  }
);
```

### Frontend Usage

```vue
<!-- Using the FileUpload component -->
<FileUpload
  upload-type="single-image"
  category="gallery"
  :max-file-size="5"
  @upload-success="handleUploadSuccess"
  @upload-error="handleUploadError"
/>

<!-- Using the image resolver -->
<script>
import imageResolver from '@/services/imageResolver';

// Resolve image URL
const imageUrl = imageResolver.resolve(project.project_image);

// Get image style for CSS
const imageStyle = imageResolver.getImageStyle(gallery.image_file_name, {
  width: 300,
  height: 200
});
</script>
```

## Database Schema Updates

### Project Model
- Added `project_image_type` field ('static' | 'uploaded')
- Added `uploaded_file_id` reference to UploadedFile

### Gallery Model  
- Added `image_type` field ('static' | 'uploaded')
- Added `uploaded_file_id` reference to UploadedFile

### UploadedFile Model (New)
- Tracks all uploaded files
- Maintains metadata and relationships
- Supports soft deletion

## Migration Strategy

### Phase 1: Coexistence (Current)
- Static assets continue to work unchanged
- New uploads are stored in database and file system
- Image resolver handles both types transparently

### Phase 2: Migration (Future)
- Gradually migrate critical static assets to upload system
- Update database records to reference uploaded files
- Remove unused static assets

### Phase 3: Full Dynamic (Future)
- All images managed through upload system
- Static assets only for core UI elements
- Complete admin control over all content images

## Security Features

1. **File Type Validation**
   - MIME type checking
   - File extension validation
   - Configurable allowed types

2. **File Size Limits**
   - Per-file size limits
   - Configurable by file type
   - Total upload size limits

3. **Access Control**
   - JWT authentication required
   - Role-based permissions
   - User ownership validation

4. **Path Security**
   - No direct file system access
   - Sanitized file names
   - Organized directory structure

## Performance Optimizations

1. **Organized Storage**
   - Files organized by category
   - Prevents large single directories
   - Easier file management

2. **Metadata Caching**
   - Database stores file metadata
   - Reduces file system queries
   - Enables fast searches/filters

3. **Static File Serving**
   - Direct Express static serving
   - No application logic overhead
   - CDN-ready structure

## Backup and Maintenance

1. **File Backup**
   - Include `/uploads` directory in backups
   - Database contains file manifests
   - Orphan file detection possible

2. **Cleanup Tasks**
   - Soft-deleted file cleanup
   - Orphaned file detection
   - Storage usage monitoring

## Future Enhancements

1. **Image Processing**
   - Automatic thumbnail generation
   - Image optimization/compression
   - Multiple size variants

2. **CDN Integration**
   - AWS S3 / CloudFront support
   - External storage options
   - Improved performance

3. **Advanced Features**
   - Image editing tools
   - Bulk operations
   - Version control

## Troubleshooting

### Common Issues

1. **File Not Found (404)**
   - Check file exists in uploads directory
   - Verify database record exists
   - Ensure correct URL path

2. **Upload Fails**
   - Check file size limits
   - Verify file type allowed
   - Ensure directory permissions

3. **Images Not Displaying**
   - Check image resolver configuration
   - Verify static file serving enabled
   - Test direct file URL access

### Debug Tools

1. **File Stats Endpoint**
   - `/api/files/stats` shows upload statistics
   - Helps identify storage issues

2. **File Listing**
   - `/api/files?category=images` lists files
   - Filter by category, date, etc.

3. **Database Queries**
   - Query UploadedFile model directly
   - Check file metadata and relationships

## Conclusion

This file upload system provides a robust, scalable solution for managing both static and dynamic files in the Pyrmont Action SDS website. It maintains backward compatibility while adding powerful new capabilities for content management.

The hybrid approach ensures a smooth transition from static assets to dynamic uploads, giving administrators full control over website content while maintaining performance and security.