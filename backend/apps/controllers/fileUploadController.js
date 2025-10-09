const UploadedFile = require('../models/uploadedFileModel');
const fileService = require('../services/fileService');
const fs = require('fs');
const path = require('path');

module.exports = {
  /**
   * Upload single file
   */
  async uploadSingleFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { category = 'general', description, tags, associatedModel, associatedId } = req.body;
      
      const processedFile = fileService.processUploadedFile(req.file, category);
      
      const uploadedFile = new UploadedFile({
        ...processedFile,
        uploadedBy: req.user.id,
        description,
        tags: tags ? (typeof tags === 'string' ? tags.split(',') : tags) : [],
        associatedModel,
        associatedId,
      });

      await uploadedFile.save();

      res.status(201).json({
        message: 'File uploaded successfully',
        file: uploadedFile,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
  },

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const { category = 'general', description, tags, associatedModel, associatedId } = req.body;
      
      const processedFiles = fileService.processUploadedFiles(req.files, category);
      
      const uploadedFiles = await Promise.all(
        processedFiles.map(async (processedFile) => {
          const uploadedFile = new UploadedFile({
            ...processedFile,
            uploadedBy: req.user.id,
            description,
            tags: tags ? (typeof tags === 'string' ? tags.split(',') : tags) : [],
            associatedModel,
            associatedId,
          });
          return uploadedFile.save();
        })
      );

      res.status(201).json({
        message: 'Files uploaded successfully',
        files: uploadedFiles,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Error uploading files', error: error.message });
    }
  },

  /**
   * Get all files (with filters)
   */
  async getFiles(req, res) {
    try {
      const { 
        category, 
        page = 1, 
        limit = 50,
        associatedModel,
        associatedId,
        tags,
        uploadedBy,
        isActive = true 
      } = req.query;

      const query = { isActive: isActive === 'true' };
      
      if (category) query.category = category;
      if (associatedModel) query.associatedModel = associatedModel;
      if (associatedId) query.associatedId = associatedId;
      if (uploadedBy) query.uploadedBy = uploadedBy;
      if (tags) query.tags = { $in: tags.split(',') };

      const skip = (page - 1) * parseInt(limit);
      const files = await UploadedFile.find(query)
        .populate('uploadedBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await UploadedFile.countDocuments(query);

      res.json({
        files,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ message: 'Error fetching files', error: error.message });
    }
  },

  /**
   * Get single file by ID
   */
  async getFileById(req, res) {
    try {
      const file = await UploadedFile.findById(req.params.id)
        .populate('uploadedBy', 'firstName lastName email');
      
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      res.json(file);
    } catch (error) {
      console.error('Error fetching file:', error);
      res.status(500).json({ message: 'Error fetching file', error: error.message });
    }
  },

  /**
   * Update file metadata
   */
  async updateFile(req, res) {
    try {
      const { description, tags, associatedModel, associatedId } = req.body;
      
      const file = await UploadedFile.findById(req.params.id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Check if user owns the file or is admin
      if (file.uploadedBy.toString() !== req.user.id && !req.user.role.name.includes('admin')) {
        return res.status(403).json({ message: 'Not authorized to update this file' });
      }

      if (description !== undefined) file.description = description;
      if (tags !== undefined) file.tags = typeof tags === 'string' ? tags.split(',') : tags;
      if (associatedModel !== undefined) file.associatedModel = associatedModel;
      if (associatedId !== undefined) file.associatedId = associatedId;

      await file.save();

      res.json({
        message: 'File updated successfully',
        file,
      });
    } catch (error) {
      console.error('Error updating file:', error);
      res.status(500).json({ message: 'Error updating file', error: error.message });
    }
  },

  /**
   * Delete file (soft delete by default)
   */
  async deleteFile(req, res) {
    try {
      const { permanent = false } = req.query;
      
      const file = await UploadedFile.findById(req.params.id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Check if user owns the file or is admin
      if (file.uploadedBy.toString() !== req.user.id && !req.user.role.name.includes('admin')) {
        return res.status(403).json({ message: 'Not authorized to delete this file' });
      }

      if (permanent === 'true') {
        // Permanent deletion - remove from filesystem and database
        const deleted = fileService.deleteFile(file.relativePath);
        if (deleted) {
          await UploadedFile.findByIdAndDelete(req.params.id);
          res.json({ message: 'File permanently deleted' });
        } else {
          res.status(500).json({ message: 'Error deleting file from filesystem' });
        }
      } else {
        // Soft deletion
        await file.softDelete();
        res.json({ message: 'File moved to trash' });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ message: 'Error deleting file', error: error.message });
    }
  },

  /**
   * Restore soft-deleted file
   */
  async restoreFile(req, res) {
    try {
      const file = await UploadedFile.findById(req.params.id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Check if user owns the file or is admin
      if (file.uploadedBy.toString() !== req.user.id && !req.user.role.name.includes('admin')) {
        return res.status(403).json({ message: 'Not authorized to restore this file' });
      }

      file.isActive = true;
      await file.save();

      res.json({
        message: 'File restored successfully',
        file,
      });
    } catch (error) {
      console.error('Error restoring file:', error);
      res.status(500).json({ message: 'Error restoring file', error: error.message });
    }
  },

  /**
   * Get file categories and counts
   */
  async getFileStats(req, res) {
    try {
      const stats = await UploadedFile.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalSize: { $sum: '$size' },
          },
        },
        { $sort: { count: -1 } },
      ]);

      const totalFiles = await UploadedFile.countDocuments({ isActive: true });
      const totalSize = stats.reduce((sum, stat) => sum + stat.totalSize, 0);

      res.json({
        categories: stats,
        totals: {
          files: totalFiles,
          size: totalSize,
        },
      });
    } catch (error) {
      console.error('Error fetching file stats:', error);
      res.status(500).json({ message: 'Error fetching file stats', error: error.message });
    }
  },
};