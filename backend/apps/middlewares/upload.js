const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = path.join(__dirname, '../uploads/meeting-minutes');
fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') return cb(new Error('PDF files only'));
    cb(null, true);
  },
});

module.exports = { upload };
