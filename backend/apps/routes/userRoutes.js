const controller = require('../controllers/userController');
const jwtAuth = require('../middlewares/jwtMiddleware');
const router = require('express').Router();

router.get('/me', jwtAuth.verifyToken, controller.getCurrentUser); // Get current user's profile
router.put('/me', jwtAuth.verifyToken, controller.updateCurrentUser); // Update current user's profile

module.exports = router;
