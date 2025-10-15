const router = require('express').Router();
const ctrl = require('../controllers/meetingMinuteController');
const { upload } = require('../middlewares/fileUpload');
const jwtAuth = require('../middlewares/jwtMiddleware');

// Create
// Create meeting minute with file upload
router.post('/', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    upload.meetingMinuteFile, 
    ctrl.createMeeting
);

// Read
// List all
router.get('/', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin']),
    ctrl.getAllMeetings
);
// List published
router.get('/published', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['member']),
    ctrl.getPublishedMeeting
);


// Update
// Upload or replace file for existing meeting minute
router.post('/:id/upload', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    upload.meetingMinuteFile,
    ctrl.uploadFile
);

// Change status to "published"
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

router.put('/:id/upload', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']),
    upload.meetingMinuteFile,
    ctrl.updateMeetingWithFile
);


// Delete
// Route to delete an existing meeting minute
router.delete('/:id', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    ctrl.deleteMeeting
);

module.exports = router;
