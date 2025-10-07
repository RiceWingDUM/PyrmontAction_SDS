const controller = require('../controllers/galleryController'); 
const router = require('express').Router();

router.get('/', controller.getAllGalleryImage);

module.exports = router;
