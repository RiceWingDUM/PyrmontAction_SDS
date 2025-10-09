const router = require('express').Router();
const controller = require('../controllers/fileUploadController');
const { upload } = require('../middlewares/fileUpload');
const jwtAuth = require('../middlewares/jwtMiddleware');

// Upload routes (protected)
router.post('/single/image', 
  jwtAuth.verifyToken,
  jwtAuth.verifyRole(['admin', 'editor']),
  upload.singleImage,
  controller.uploadSingleFile
);

router.post('/single/pdf', 
  jwtAuth.verifyToken,
  jwtAuth.verifyRole(['admin', 'editor']),
  upload.singlePDF,
  controller.uploadSingleFile
);

router.post('/multiple/images', 
  jwtAuth.verifyToken,
  jwtAuth.verifyRole(['admin', 'editor']),
  upload.multipleImages,
  controller.uploadMultipleFiles
);

router.post('/multiple/pdfs', 
  jwtAuth.verifyToken,
  jwtAuth.verifyRole(['admin', 'editor']),
  upload.multiplePDFs,
  controller.uploadMultipleFiles
);

router.post('/project/image', 
  jwtAuth.verifyToken,
  jwtAuth.verifyRole(['admin', 'editor']),
  upload.projectImage,
  controller.uploadSingleFile
);

// File management routes (protected)
router.get('/', 
  jwtAuth.verifyToken,
  controller.getFiles
);

router.get('/stats', 
  jwtAuth.verifyToken,
  jwtAuth.verifyRole(['admin']),
  controller.getFileStats
);

router.get('/:id', 
  jwtAuth.verifyToken,
  controller.getFileById
);

router.put('/:id', 
  jwtAuth.verifyToken,
  controller.updateFile
);

router.delete('/:id', 
  jwtAuth.verifyToken,
  controller.deleteFile
);

router.post('/:id/restore', 
  jwtAuth.verifyToken,
  controller.restoreFile
);

module.exports = router;