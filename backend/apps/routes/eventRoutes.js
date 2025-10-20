const router = require('express').Router();
const controller = require('../controllers/eventController');
const jwtAuth = require('../middlewares/jwtMiddleware');
const { upload } = require('../middlewares/fileUpload');

router.post('/', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin', 'member']), 
    upload.eventImage, 
    controller.createEvent
);

router.get('/upcoming', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'member']),
    controller.getUpcomingEvents
);

router.get('/published',
    controller.getPublishedEvents
);

router.get('/completed',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'member']),
    controller.getCompletedEvents
);

router.get('/:id',
    controller.getEvent
);

router.put('/:id',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'member']),
    upload.eventImage,
    controller.updateEvent
);

router.put('/:id/publish',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'member']),
    controller.publishEvent
);

router.delete('/:id',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin']),
    controller.deleteEvent
);

module.exports = router;
