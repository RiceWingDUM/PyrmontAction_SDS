const router = require('express').Router();
const ctrl = require('../controllers/meetingMinuteController');
const { upload } = require('../middlewares/fileUpload');
const jwtAuth = require('../middlewares/jwtMiddleware');

// Public
router.get('/', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin']),
    ctrl.getAllMeetings
);

router.get('/published', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['member']),
    ctrl.getPublishedMeeting
);

// Protected - Create meeting minute (with optional file upload)
router.post('/', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    upload.meetingMinuteFile, 
    ctrl.createMeeting
);

// Upload file to existing meeting minute
router.post('/:id/upload', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    upload.meetingMinuteFile, 
    ctrl.uploadFile
);

router.patch('/:id/publish', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    ctrl.publishMeeting
);


// Route to update an existing meeting minute
router.put('/:id', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    ctrl.updateMeeting
);

// Route to delete an existing meeting minute
router.delete('/:id', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    ctrl.deleteMeeting
);

module.exports = router;
