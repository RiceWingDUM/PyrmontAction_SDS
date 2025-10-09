const fs = require('fs');
const path = require('path');

class FileService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../uploads');
  }

  /**
   * Get file path relative to uploads directory
   * @param {string} filePath - Absolute path to file
   * @returns {string} - Relative path from uploads directory
   */
  getRelativePath(filePath) {
    return path.relative(this.uploadsDir, filePath).replace(/\\/g, '/');
  }

  /**
   * Get full URL path for serving files
   * @param {string} relativePath - Relative path from uploads directory
   * @returns {string} - URL path for serving
   */
  getFileURL(relativePath) {
    return `/uploads/${relativePath}`;
  }

  /**
   * Delete file from filesystem
   * @param {string} relativePath - Relative path from uploads directory
   * @returns {boolean} - Success status
   */
  deleteFile(relativePath) {
    try {
      const fullPath = path.join(this.uploadsDir, relativePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Check if file exists
   * @param {string} relativePath - Relative path from uploads directory
   * @returns {boolean} - File exists status
   */
  fileExists(relativePath) {
    const fullPath = path.join(this.uploadsDir, relativePath);
    return fs.existsSync(fullPath);
  }

  /**
   * Get file information
   * @param {string} relativePath - Relative path from uploads directory
   * @returns {object|null} - File stats or null if not found
   */
  getFileInfo(relativePath) {
    try {
      const fullPath = path.join(this.uploadsDir, relativePath);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        return {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isFile: stats.isFile(),
          extension: path.extname(fullPath).toLowerCase(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  }

  /**
   * Process uploaded file and return standardized response
   * @param {object} file - Multer file object
   * @param {string} category - File category (images, pdfs, etc.)
   * @returns {object} - Processed file information
   */
  processUploadedFile(file, category = 'general') {
    if (!file) return null;

    const relativePath = this.getRelativePath(file.path);
    const url = this.getFileURL(relativePath);
    
    return {
      filename: file.filename,
      originalName: file.originalname,
      relativePath,
      url,
      size: file.size,
      mimetype: file.mimetype,
      category,
      uploadedAt: new Date(),
    };
  }

  /**
   * Process multiple uploaded files
   * @param {array} files - Array of multer file objects
   * @param {string} category - File category
   * @returns {array} - Array of processed file information
   */
  processUploadedFiles(files, category = 'general') {
    if (!files || !Array.isArray(files)) return [];
    return files.map(file => this.processUploadedFile(file, category));
  }
}

module.exports = new FileService();