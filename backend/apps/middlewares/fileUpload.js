const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directories
const uploadDirs = {
  images: path.join(__dirname, '../uploads/images'),
  pdfs: path.join(__dirname, '../uploads/pdfs'),
  meetingMinutes: path.join(__dirname, '../uploads/meeting-minutes'),
  gallery: path.join(__dirname, '../uploads/gallery'),
  projects: path.join(__dirname, '../uploads/projects'),
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

// Upload configurations
const uploadConfigs = {
  // Single image upload (for projects, gallery, etc.)
  singleImage: multer({
    storage: createStorage('images'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFilter,
  }).single('image'),

  // Multiple image upload (for gallery batch upload)
  multipleImages: multer({
    storage: createStorage('gallery'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
    fileFilter: imageFilter,
  }).array('images', 10), // Max 10 images

  // PDF upload (for meeting minutes, documents)
  singlePDF: multer({
    storage: createStorage('pdfs'),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
    fileFilter: pdfFilter,
  }).single('pdf'),

  // Multiple PDFs
  multiplePDFs: multer({
    storage: createStorage('meetingMinutes'),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB per file
    fileFilter: pdfFilter,
  }).array('pdfs', 5), // Max 5 PDFs

  // Mixed documents
  documents: multer({
    storage: createStorage('pdfs'),
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
    fileFilter: documentFilter,
  }).array('documents', 5),

  // Project specific (images for projects)
  projectImage: multer({
    storage: createStorage('projects'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFilter,
  }).single('projectImage'),
};

module.exports = {
  upload: uploadConfigs,
  uploadDirs,
};