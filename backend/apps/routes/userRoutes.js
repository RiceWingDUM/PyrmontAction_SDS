const controller = require('../controllers/userController');
const jwtAuth = require('../middlewares/jwtMiddleware');
const router = require('express').Router();

router.get('/me', jwtAuth.verifyToken, controller.getCurrentUser); // Get current user's profile

module.exports = router;
