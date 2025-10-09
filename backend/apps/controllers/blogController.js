const Blog = require('../models/blogModel');

module.exports = {
  // Create blog with optional image upload
  async createBlog(req, res) {
    try {
      const { title, content, excerpt, author, tags, status } = req.body;
      
      // Create blog data
      const blogData = {
        title,
        content,
        excerpt,
        author,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
        status: status || 'draft'
      };

      // If image was uploaded, process it
      if (req.file) {
        // Add image info to blog
        blogData.featuredImage = `/uploads/blogs/${req.file.filename}`;
        blogData.originalFileName = req.file.originalname;
        blogData.imageType = 'uploaded';
      }

      const blog = new Blog(blogData);
      await blog.save();

      res.status(201).json({
        message: 'Blog created successfully',
        blog: blog
      });
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({ message: error.message });
    }
  },

  // Upload image to existing blog
  async uploadBlogImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
      }

      const blogId = req.params.id;
      const blog = await Blog.findById(blogId);
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      // Update blog with image info
      blog.featuredImage = `/uploads/blogs/${req.file.filename}`;
      blog.originalFileName = req.file.originalname;
      blog.imageType = 'uploaded';

      await blog.save();

      res.status(200).json({
        message: 'Image uploaded successfully',
        blog: blog
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get all published blogs
  async getPublishedBlogs(req, res) {
    try {
      const { tag, author, limit = 10, page = 1 } = req.query;
      const query = { status: 'published' };
      
      // Filter by tag if provided
      if (tag) {
        query.tags = { $in: [tag] };
      }
      
      // Filter by author if provided
      if (author) {
        query.author = new RegExp(author, 'i');
      }

      const skip = (page - 1) * limit;
      
      const blogs = await Blog.find(query)
        .sort({ publishedAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

      const total = await Blog.countDocuments(query);

      res.json({
        blogs,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get all blogs (admin only)
  async getAllBlogs(req, res) {
    try {
      const { status, author, limit = 10, page = 1 } = req.query;
      const query = {};
      
      if (status) query.status = status;
      if (author) query.author = new RegExp(author, 'i');

      const skip = (page - 1) * limit;
      
      const blogs = await Blog.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

      const total = await Blog.countDocuments(query);

      res.json({
        blogs,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single blog by ID
  async getBlogById(req, res) {
    try {
      const blog = await Blog.findById(req.params.id);
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      // Increment view count for published blogs
      if (blog.status === 'published') {
        blog.views += 1;
        await blog.save();
      }

      res.json(blog);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update blog
  async updateBlog(req, res) {
    try {
      const { tags } = req.body;
      
      // Process tags if provided
      if (tags) {
        req.body.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
      }

      const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      res.json({
        message: 'Blog updated successfully',
        blog: blog
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Delete blog
  async deleteBlog(req, res) {
    try {
      const blog = await Blog.findByIdAndDelete(req.params.id);
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      // File cleanup would be handled at the file system level if needed

      res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Publish blog
  async publishBlog(req, res) {
    try {
      const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { status: 'published', publishedAt: new Date() },
        { new: true }
      );
      
      if (!blog) {
        return res.status(404).json({ message: 'Blog not found' });
      }

      res.json({
        message: 'Blog published successfully',
        blog: blog
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};