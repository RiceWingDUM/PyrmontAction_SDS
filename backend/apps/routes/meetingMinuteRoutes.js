const router = require('express').Router();
const ctrl = require('../controllers/meetingMinuteController');
const { upload } = require('../middlewares/upload');
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

// Protected
router.post('/upload', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin']), 
    // upload.single('pdf'), 
    ctrl.createMeeting
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

module.exports = router;
