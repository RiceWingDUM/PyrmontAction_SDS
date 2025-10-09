const router = require('express').Router();
const ctrl = require('../controllers/blogController');
const jwtAuth = require('../middlewares/jwtMiddleware');
const { upload } = require('../middlewares/fileUpload');

// Public routes
router.get('/', ctrl.getPublishedBlogs); // Get published blogs with pagination and filters
router.get('/public/:id', ctrl.getBlogById); // Get single blog by ID (public)

// Protected routes - Admin/Editor only
router.get('/all', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    ctrl.getAllBlogs
); // Get all blogs (including drafts)

router.get('/:id', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    ctrl.getBlogById
); // Get single blog (admin/editor)

router.post('/', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    upload.blogImage,
    ctrl.createBlog
); // Create blog with optional image

router.post('/:id/upload-image', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    upload.blogImage,
    ctrl.uploadBlogImage
); // Upload image to existing blog

router.put('/:id', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    ctrl.updateBlog
); // Update blog

router.delete('/:id', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    ctrl.deleteBlog
); // Delete blog

router.patch('/:id/publish', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    ctrl.publishBlog
); // Publish blog

module.exports = router;