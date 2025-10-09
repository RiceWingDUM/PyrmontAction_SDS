# Feature-Specific File Upload System

## Overview

The file upload system has been restructured to organize uploads by feature/module instead of file type. Each feature now has its own dedicated upload directory and specific upload endpoints.

## Upload Structure

```
backend/apps/uploads/
├── projects/          # Project images
├── gallery/           # Gallery images  
├── meeting-minutes/   # Meeting minute PDFs
├── events/           # Event images and documents
├── blogs/            # Blog images
└── temp/             # Temporary files
```

## Feature-Specific Upload Endpoints

### 1. Projects (`/api/projects`)
- **Create with image**: `POST /api/projects` (with `projectImage` field)
- **Upload to existing**: `POST /api/projects/:id/upload-image`
- **File types**: Images only (JPEG, PNG, GIF, WebP)
- **Size limit**: 5MB
- **Storage**: `/uploads/projects/`

### 2. Gallery (`/api/gallery`)
- **Single upload**: `POST /api/gallery` (with `galleryImage` field)
- **Multiple upload**: `POST /api/gallery/multiple` (with `galleryImages` field)
- **File types**: Images only (JPEG, PNG, GIF, WebP)
- **Size limit**: 5MB per image
- **Max files**: 10 for batch upload
- **Storage**: `/uploads/gallery/`

### 3. Meeting Minutes (`/api/minutes`)
- **Create with file**: `POST /api/minutes` (with `meetingMinuteFile` field)
- **Upload to existing**: `POST /api/minutes/:id/upload`
- **File types**: PDF only
- **Size limit**: 15MB
- **Storage**: `/uploads/meeting-minutes/`

### 4. Events (`/api/events`)
- **Create with file**: `POST /api/events` (with `eventFile` field)
- **Upload to existing**: `POST /api/events/:id/upload`
- **File types**: Images and documents (JPEG, PNG, GIF, WebP, PDF, DOC, DOCX, TXT)
- **Size limit**: 10MB
- **Storage**: `/uploads/events/`

### 5. Blogs (`/api/blogs`)
- **Create with image**: `POST /api/blogs` (with `blogImage` field)
- **Upload to existing**: `POST /api/blogs/:id/upload-image`
- **File types**: Images only (JPEG, PNG, GIF, WebP)
- **Size limit**: 5MB
- **Storage**: `/uploads/blogs/`

## Database Schema Updates

### UploadedFile Model
- **Categories**: `projects`, `gallery`, `meeting-minutes`, `events`, `blogs`
- **Associations**: Tracks which model and ID the file belongs to

### Feature Models
All feature models now include:
- `fileUrl/imageUrl`: URL to the uploaded file
- `originalFileName`: Original filename for display
- `fileType/imageType`: 'static' or 'uploaded'
- `uploadedFileId`: Reference to UploadedFile record

## Usage Examples

### Frontend - Creating a Project with Image

```javascript
const formData = new FormData();
formData.append('project_name', 'New Project');
formData.append('project_description', 'Description');
formData.append('projectImage', imageFile);

const response = await fetch('/api/projects', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

### Frontend - Upload Meeting Minutes

```javascript
const formData = new FormData();
formData.append('title', 'Meeting Title');
formData.append('meetingDate', '2025-01-15');
formData.append('meetingMinuteFile', pdfFile);

const response = await fetch('/api/minutes', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

### Frontend - Gallery Batch Upload

```javascript
const formData = new FormData();
imageFiles.forEach(file => {
  formData.append('galleryImages', file);
});

const response = await fetch('/api/gallery/multiple', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

## File Serving

All uploaded files are served statically from `/uploads/` endpoint:
- Projects: `http://localhost:5000/uploads/projects/filename.jpg`
- Gallery: `http://localhost:5000/uploads/gallery/filename.jpg`
- Meeting Minutes: `http://localhost:5000/uploads/meeting-minutes/filename.pdf`
- Events: `http://localhost:5000/uploads/events/filename.jpg`
- Blogs: `http://localhost:5000/uploads/blogs/filename.jpg`

## Security & Validation

### File Type Validation
- **Images**: JPEG, JPG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, TXT
- **Mixed Content** (Events): Images + Documents

### Access Control
- All upload endpoints require authentication
- Role-based permissions:
  - **Admin**: Full access to all features
  - **Editor**: Access to projects, gallery, blogs
  - **Member**: Read-only access

### File Size Limits
- **Images**: 5MB
- **Documents/PDFs**: 15MB
- **Mixed Content**: 10MB

## Error Handling

Common error responses:
- `400`: No file uploaded, invalid file type, file too large
- `401`: Authentication required
- `403`: Insufficient permissions
- `404`: Resource not found
- `500`: Server error during upload/processing

## Migration Notes

### Removed Categories
- General `images` and `pdfs` categories removed
- All uploads now feature-specific

### Backward Compatibility
Existing static assets continue to work through the imageResolver service, which handles both static and uploaded files.

## Testing

Test each feature's upload functionality:
1. Create new records with file uploads
2. Upload files to existing records
3. Verify files are stored in correct directories
4. Test file serving URLs
5. Verify database associations

## Future Enhancements

1. **File Versioning**: Track multiple versions of uploaded files
2. **Image Processing**: Automatic resizing/optimization
3. **Cloud Storage**: Integration with AWS S3 or similar
4. **Bulk Operations**: Batch delete, move operations
5. **File Metadata**: Extract and store EXIF data, document properties