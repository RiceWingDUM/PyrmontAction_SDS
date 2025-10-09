const fs = require('fs');
const path = require('path');

// Create feature-specific upload directories
const uploadDirs = [
  'uploads',
  'uploads/gallery',
  'uploads/projects',
  'uploads/meeting-minutes',
  'uploads/events',
  'uploads/blogs',
  'uploads/temp'
];

console.log('Setting up upload directories...');

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  try {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ Created: ${dir}`);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error(`✗ Failed to create: ${dir}`, error.message);
    } else {
      console.log(`✓ Already exists: ${dir}`);
    }
  }
});

// Create .gitkeep files to ensure directories are tracked in git
uploadDirs.forEach(dir => {
  const gitkeepPath = path.join(__dirname, dir, '.gitkeep');
  try {
    fs.writeFileSync(gitkeepPath, '# This file ensures the directory is tracked in git\n');
  } catch (error) {
    console.error(`Failed to create .gitkeep in ${dir}:`, error.message);
  }
});

console.log('\n📁 Upload directory structure created successfully!');
console.log('\nNext steps:');
console.log('1. Install multer if not already installed: npm install multer');
console.log('2. Restart your server to load the new file upload routes');
console.log('3. Test file uploads using the FileManagerAdmin component');

module.exports = { uploadDirs };