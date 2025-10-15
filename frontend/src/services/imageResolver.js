// Unified image resolution service
class ImageResolver {
  constructor() {
    this.server = import.meta.env.VITE_API_URL || "http://localhost:5000";
    
    // Import all static assets at build time
    this.staticAssets = {};
    this.loadStaticAssets();
  }

  async loadStaticAssets() {
    try {
      // Load Gallery assets
      const galleryModules = import.meta.glob('@/assets/Gallery/*', 
        { eager: true, import: 'default' });
      
      // Load Projects assets  
      const projectModules = import.meta.glob('@/assets/Projects/*', 
        { eager: true, import: 'default' });
      
      // Combine all static assets
      this.staticAssets = {
        ...this.processAssetModules(galleryModules, 'gallery'),
        ...this.processAssetModules(projectModules, 'projects'),
      };
    } catch (error) {
      console.warn('Could not load static assets:', error);
    }
  }

  processAssetModules(modules, category) {
    const assets = {};
    Object.entries(modules).forEach(([path, url]) => {
      const filename = path.match(/[^/\\]+$/)[0];
      assets[filename] = {
        url,
        category,
        type: 'static'
      };
    });
    return assets;
  }

  /**
   * Resolve image URL from various sources
   * @param {string|object} imageRef - Image reference (filename, URL, or object)
   * @param {string} fallback - Fallback image URL
   * @returns {string} - Resolved image URL
   */
  resolve(imageRef, fallback = null) {
    if (!imageRef) return fallback;

    // Handle different input types
    if (typeof imageRef === 'object') {
      return this.resolveFromObject(imageRef, fallback);
    }

    if (typeof imageRef === 'string') {
      return this.resolveFromString(imageRef, fallback);
    }

    return fallback;
  }

  resolveFromObject(imageObj, fallback) {
    // Handle preview objects (from file inputs)
    if (imageObj.src) {
      return imageObj.src;
    }

    // Handle uploaded file objects
    if (imageObj.url || imageObj.relativePath) {
      return this.getUploadedFileUrl(imageObj.url || imageObj.relativePath);
    }

    // Handle database objects with image references
    if (imageObj.image_file_name || imageObj.project_image) {
      const filename = imageObj.image_file_name || imageObj.project_image;
      const type = imageObj.image_type || imageObj.project_image_type || 'static';
      
      if (type === 'uploaded' && imageObj.uploaded_file_id) {
        // For uploaded files, construct URL from uploaded_file_id
        return this.getUploadedFileUrl(filename);
      } else {
        // For static files, look up in static assets
        return this.getStaticAssetUrl(filename, fallback);
      }
    }

    return fallback;
  }

  resolveFromString(imageStr, fallback) {
    // Already a full URL
    if (/^https?:\/\//.test(imageStr)) {
      return imageStr;
    }

    // Uploaded file URL path
    if (imageStr.startsWith('/uploads/')) {
      return this.server + imageStr;
    }

    // Relative uploaded file path
    if (imageStr.includes('/') && !imageStr.startsWith('/')) {
      return this.getUploadedFileUrl(imageStr);
    }

    // Static asset filename
    return this.getStaticAssetUrl(imageStr, fallback);
  }

  getUploadedFileUrl(relativePath) {
    // Ensure proper formatting
    const cleanPath = relativePath.replace(/^\/uploads\//, '').replace(/\\/g, '/');
    return `${this.server}/uploads/${cleanPath}`;
  }

  getStaticAssetUrl(filename, fallback) {
    const asset = this.staticAssets[filename];
    if (asset) {
      return asset.url;
    }

    // Try to find partial matches
    const partialMatch = Object.keys(this.staticAssets).find(key => 
      key.toLowerCase().includes(filename.toLowerCase()) ||
      filename.toLowerCase().includes(key.toLowerCase())
    );

    if (partialMatch) {
      return this.staticAssets[partialMatch].url;
    }

    return fallback;
  }

  /**
   * Get image style object for CSS background
   * @param {string|object} imageRef - Image reference
   * @param {object} options - Style options
   * @returns {object} - CSS style object
   */
  getImageStyle(imageRef, options = {}) {
    const {
      width = 160,
      height = 96,
      borderRadius = '10px',
      border = '1px solid #ccc',
      backgroundSize = 'cover',
      backgroundPosition = 'center',
      backgroundColor = '#fff',
      fallback = null
    } = options;

    const url = this.resolve(imageRef, fallback);
    
    const baseStyle = {
      width: `${width}px`,
      height: `${height}px`,
      borderRadius,
      border,
      overflow: 'hidden',
      backgroundSize,
      backgroundPosition,
      backgroundColor
    };

    if (url) {
      baseStyle.backgroundImage = `url('${url}')`;
    }

    return baseStyle;
  }

  /**
   * Preload images for better performance
   * @param {array} imageRefs - Array of image references
   */
  async preloadImages(imageRefs) {
    const promises = imageRefs.map(imageRef => {
      return new Promise((resolve) => {
        const url = this.resolve(imageRef);
        if (url) {
          const img = new Image();
          img.onload = () => resolve(url);
          img.onerror = () => resolve(null);
          img.src = url;
        } else {
          resolve(null);
        }
      });
    });

    return Promise.all(promises);
  }

  /**
   * Check if image exists
   * @param {string|object} imageRef - Image reference
   * @returns {Promise<boolean>} - Whether image exists
   */
  async imageExists(imageRef) {
    const url = this.resolve(imageRef);
    if (!url) return false;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  /**
   * Get placeholder image URL
   * @param {number} width - Placeholder width
   * @param {number} height - Placeholder height
   * @param {string} text - Placeholder text
   * @returns {string} - Placeholder image URL
   */
  getPlaceholder(width = 300, height = 200, text = 'No Image') {
    return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
  }
}

// Create singleton instance
const imageResolver = new ImageResolver();

export default imageResolver;