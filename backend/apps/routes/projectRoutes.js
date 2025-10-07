const controller = require('../controllers/projectController');
const router = require('express').Router();
const jwtAuth = require('../middlewares/jwtMiddleware');
const validator = require('../validations/projectValidaiton');

//Create
router.post('/', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin', 'editor']),
    validator.validateProjectInput,
    controller.createProject
);

//Read
router.get('/open', controller.openProjects);
router.get('/closed', controller.closedProjects);
router.get('/:id', controller.getProject);

//Update
router.put('/:id', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin', 'editor']),
    validator.validateProjectInput,
    controller.updateProject
);

//Delete
router.delete('/:id', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.deleteProject
);

module.exports = router;
