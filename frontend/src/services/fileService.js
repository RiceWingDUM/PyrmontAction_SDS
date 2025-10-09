import api from './api';

const fileService = {
  // Upload single image
  async uploadImage(token, file, metadata = {}) {
    const formData = new FormData();
    formData.append('image', file);
    
    // Add metadata
    Object.keys(metadata).forEach(key => {
      if (metadata[key] !== undefined && metadata[key] !== null) {
        formData.append(key, metadata[key]);
      }
    });

    return api.postFormData('api/files/single/image', formData, token);
  },

  // Upload single PDF
  async uploadPDF(token, file, metadata = {}) {
    const formData = new FormData();
    formData.append('pdf', file);
    
    Object.keys(metadata).forEach(key => {
      if (metadata[key] !== undefined && metadata[key] !== null) {
        formData.append(key, metadata[key]);
      }
    });

    return api.postFormData('api/files/single/pdf', formData, token);
  },

  // Upload multiple images
  async uploadMultipleImages(token, files, metadata = {}) {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('images', file);
    });
    
    Object.keys(metadata).forEach(key => {
      if (metadata[key] !== undefined && metadata[key] !== null) {
        formData.append(key, metadata[key]);
      }
    });

    return api.postFormData('api/files/multiple/images', formData, token);
  },

  // Upload project image
  async uploadProjectImage(token, file, metadata = {}) {
    const formData = new FormData();
    formData.append('projectImage', file);
    
    Object.keys(metadata).forEach(key => {
      if (metadata[key] !== undefined && metadata[key] !== null) {
        formData.append(key, metadata[key]);
      }
    });

    return api.postFormData('api/files/project/image', formData, token);
  },

  // Get files with filters
  async getFiles(token, filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });

    const endpoint = `api/files${params.toString() ? '?' + params.toString() : ''}`;
    return api.get(endpoint, token);
  },

  // Get single file
  async getFile(token, fileId) {
    return api.get(`api/files/${fileId}`, token);
  },

  // Update file metadata
  async updateFile(token, fileId, metadata) {
    return api.put(`api/files/${fileId}`, metadata, token);
  },

  // Delete file
  async deleteFile(token, fileId, permanent = false) {
    const endpoint = `api/files/${fileId}${permanent ? '?permanent=true' : ''}`;
    return api.delete(endpoint, token);
  },

  // Restore file
  async restoreFile(token, fileId) {
    return api.post(`api/files/${fileId}/restore`, {}, token);
  },

  // Get file statistics
  async getFileStats(token) {
    return api.get('api/files/stats', token);
  },

  // Helper: Get full URL for file
  getFileUrl(relativePath) {
    const server = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${server}/uploads/${relativePath}`;
  },

  // Helper: Resolve image URL (handles both static and uploaded)
  resolveImageURL(img) {
    if (!img) return null;
    
    // If it's already a full URL
    if (typeof img === 'string' && /^https?:\/\//.test(img)) {
      return img;
    }
    
    // If it's an uploaded file path
    if (typeof img === 'string' && img.startsWith('/uploads/')) {
      const server = import.meta.env.VITE_API_URL || "http://localhost:5000";
      return server + img;
    }
    
    // If it's a relative uploaded file path
    if (typeof img === 'string' && (img.includes('/') || img.includes('\\'))) {
      return this.getFileUrl(img);
    }
    
    // If it's a preview object (for file inputs)
    if (typeof img === 'object' && img.src) {
      return img.src;
    }
    
    // Fallback to static assets (existing behavior)
    return img;
  },

  // Helper: Validate file type
  validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) {
    return allowedTypes.includes(file.type);
  },

  // Helper: Validate file size
  validateFileSize(file, maxSizeMB = 5) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  // Helper: Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};

export default fileService;