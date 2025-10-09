const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create feature-specific upload directories
const uploadDirs = {
  meetingMinutes: path.join(__dirname, '../uploads/meeting-minutes'),
  gallery: path.join(__dirname, '../uploads/gallery'),
  projects: path.join(__dirname, '../uploads/projects'),
  events: path.join(__dirname, '../uploads/events'),
  blogs: path.join(__dirname, '../uploads/blogs'),
};

// Ensure directories exist
Object.values(uploadDirs).forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

// Storage configuration for different file types
const createStorage = (subdir) => multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDirs[subdir]),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// File type filters
const imageFilter = (_req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

const pdfFilter = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const documentFilter = (_req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only document files (PDF, DOC, DOCX, TXT) are allowed'), false);
  }
};

// Mixed content filter (images and documents)
const mixedContentFilter = (_req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image and document files are allowed'), false);
  }
};

// Feature-specific upload configurations
const uploadConfigs = {
  // Project uploads (images only)
  projectImage: multer({
    storage: createStorage('projects'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFilter,
  }).single('projectImage'),

  // Gallery uploads (multiple images)
  galleryImages: multer({
    storage: createStorage('gallery'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
    fileFilter: imageFilter,
  }).array('galleryImages', 10), // Max 10 images

  // Single gallery image
  galleryImage: multer({
    storage: createStorage('gallery'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFilter,
  }).single('galleryImage'),

  // Meeting minutes uploads (PDFs)
  meetingMinuteFile: multer({
    storage: createStorage('meetingMinutes'),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
    fileFilter: pdfFilter,
  }).single('file'),

  // Event uploads (images and documents)
  eventFile: multer({
    storage: createStorage('events'),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: mixedContentFilter,
  }).single('eventFile'),

  // Blog uploads (images primarily)
  blogImage: multer({
    storage: createStorage('blogs'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFilter,
  }).single('blogImage'),

  // Multiple blog images
  blogImages: multer({
    storage: createStorage('blogs'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
    fileFilter: imageFilter,
  }).array('blogImages', 5), // Max 5 images
};

module.exports = {
  upload: uploadConfigs,
  uploadDirs,
};