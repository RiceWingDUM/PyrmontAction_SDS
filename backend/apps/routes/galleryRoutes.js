const controller = require('../controllers/galleryController'); 
const router = require('express').Router();
const jwtAuth = require('../middlewares/jwtMiddleware');

// Create
router.post('/',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.uploadGalleryImage
);

// Read
router.get('/', controller.getAllGalleryImage);

// Update
router.put('/:id',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.updateGalleryImage
);

// Delete
router.delete('/:id',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.deleteGalleryImage
);

module.exports = router;
