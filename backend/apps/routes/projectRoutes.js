const router = require('express').Router();
const ctrl = require('../controllers/projectController');
const { upload } = require('../middlewares/fileUpload');
const jwtAuth = require('../middlewares/jwtMiddleware');

// Create
// Create project with image upload (following meeting minutes pattern)
router.post('/', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin', 'editor']), 
    upload.projectImage, 
    ctrl.createProject
);

// Read
// List all projects
router.get('/', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    ctrl.getAllProjects
);

// List open projects (existing functionality)
router.get('/open', ctrl.openProjects);
router.get('/closed', ctrl.closedProjects);
router.get('/:id', ctrl.getProject);

// Update
// Route to update an existing project
router.put('/:id', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin', 'editor']),
    ctrl.updateProject
);

// Route to update project with file upload
router.put('/:id/upload', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin', 'editor']),
    upload.projectImage,
    ctrl.updateProjectWithFile
);

// Delete
// Route to delete an existing project
router.delete('/:id', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin', 'editor']), 
    ctrl.deleteProject
);

module.exports = router;
