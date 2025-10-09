const router = require('express').Router();
const ctrl = require('../controllers/eventController');
const jwtAuth = require('../middlewares/jwtMiddleware');
const { upload } = require('../middlewares/fileUpload');

// Public
router.get('/', ctrl.getPublishedEvents);

// Protected - Create event (with optional file upload)
router.post('/', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    upload.eventFile,
    ctrl.createEvent
);

// Upload file to existing event
router.post('/:id/upload', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    upload.eventFile,
    ctrl.uploadEventFile
);
router.put('/:id', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), ctrl.updateEvent);
router.delete('/:id', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), ctrl.deleteEvent);

module.exports = router;
