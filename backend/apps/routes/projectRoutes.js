const controller = require('../controllers/projectController');
const router = require('express').Router();
const jwtAuth = require('../middlewares/jwtMiddleware');
const validator = require('../validations/projectValidaiton');
const { upload } = require('../middlewares/fileUpload');

//Create project (with optional image upload)
router.post('/', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin', 'editor']),
    upload.projectImage,
    validator.validateProjectInput,
    controller.createProject
);

// Upload image to existing project
router.post('/:id/upload-image', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin', 'editor']),
    upload.projectImage,
    controller.uploadProjectImage
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
