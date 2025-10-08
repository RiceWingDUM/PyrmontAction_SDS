const router = require('express').Router();
const ctrl = require('../controllers/eventController');
const jwtAuth = require('../middlewares/jwtMiddleware');

// Public
router.get('/', ctrl.getPublishedEvents);

// Protected
router.post('/', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), ctrl.createEvent);
router.put('/:id', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), ctrl.updateEvent);
router.delete('/:id', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), ctrl.deleteEvent);

module.exports = router;
