const router = require('express').Router();
const ctrl = require('../controllers/meetingMinuteController');
const { upload } = require('../middlewares/upload');
const jwtAuth = require('../middlewares/jwtMiddleware');

// Public
router.get('/', 
    jwtAuth.verifyToken,
    ctrl.listPublic
);

// Protected
router.post('/upload', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    upload.single('pdf'), 
    ctrl.uploadMinutes
);
router.patch('/:id/publish', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    ctrl.publishMinutes
);

module.exports = router;
