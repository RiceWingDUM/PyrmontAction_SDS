<template>
  <div class="file-manager">
    <div class="header">
      <h2>File Manager</h2>
      <div class="header-actions">
        <button class="btn primary" @click="showUploadModal = true">
          <span>📁</span> Upload Files
        </button>
        <button class="btn" @click="refreshFiles">
          <span>🔄</span> Refresh
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <select v-model="filters.category" @change="fetchFiles">
        <option value="">All Categories</option>
        <option value="images">Images</option>
        <option value="pdfs">PDFs</option>
        <option value="gallery">Gallery</option>
        <option value="projects">Projects</option>
        <option value="meeting-minutes">Meeting Minutes</option>
      </select>
      
      <input 
        v-model="searchTerm" 
        @input="debounceSearch" 
        placeholder="Search files..." 
        class="search-input"
      >
      
      <label class="checkbox-label">
        <input type="checkbox" v-model="showDeleted" @change="fetchFiles">
        Show Deleted
      </label>
    </div>

    <!-- File Stats -->
    <div class="stats" v-if="stats">
      <div class="stat">
        <span class="stat-value">{{ stats.totals.files }}</span>
        <span class="stat-label">Total Files</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ formatFileSize(stats.totals.size) }}</span>
        <span class="stat-label">Total Size</span>
      </div>
    </div>

    <!-- Files Grid -->
    <div class="files-grid">
      <div 
        v-for="file in files" 
        :key="file._id" 
        class="file-card"
        :class="{ 'deleted': !file.isActive }"
        @click="selectFile(file)"
      >
        <div class="file-preview">
          <img 
            v-if="isImage(file)" 
            :src="getFileUrl(file.url)" 
            :alt="file.originalName"
            @error="handleImageError"
          >
          <div v-else class="file-icon">
            {{ getFileIcon(file.mimetype) }}
          </div>
        </div>
        
        <div class="file-info">
          <div class="file-name" :title="file.originalName">
            {{ truncateFileName(file.originalName) }}
          </div>
          <div class="file-meta">
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
            <span class="file-date">{{ formatDate(file.createdAt) }}</span>
          </div>
          <div class="file-category">{{ file.category }}</div>
        </div>

        <div class="file-actions">
          <button 
            class="action-btn" 
            @click.stop="copyFileUrl(file)"
            title="Copy URL"
          >📋</button>
          <button 
            class="action-btn" 
            @click.stop="downloadFile(file)"
            title="Download"
          >⬇️</button>
          <button 
            class="action-btn danger" 
            @click.stop="deleteFile(file)"
            :title="file.isActive ? 'Delete' : 'Permanently Delete'"
          >🗑️</button>
          <button 
            v-if="!file.isActive"
            class="action-btn success" 
            @click.stop="restoreFile(file)"
            title="Restore"
          >♻️</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="pagination.pages > 1">
      <button 
        :disabled="pagination.page <= 1" 
        @click="changePage(pagination.page - 1)"
      >Previous</button>
      
      <span>Page {{ pagination.page }} of {{ pagination.pages }}</span>
      
      <button 
        :disabled="pagination.page >= pagination.pages" 
        @click="changePage(pagination.page + 1)"
      >Next</button>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="modal">
      <div class="modal-content">
        <h3>Upload Files</h3>
        
        <div class="upload-section">
          <div class="upload-type">
            <label>
              <input type="radio" v-model="uploadType" value="single-image"> Single Image
            </label>
            <label>
              <input type="radio" v-model="uploadType" value="multiple-images"> Multiple Images
            </label>
            <label>
              <input type="radio" v-model="uploadType" value="single-pdf"> Single PDF
            </label>
            <label>
              <input type="radio" v-model="uploadType" value="project-image"> Project Image
            </label>
          </div>

          <div class="form-row">
            <label>Category</label>
            <select v-model="uploadForm.category">
              <option value="general">General</option>
              <option value="images">Images</option>
              <option value="gallery">Gallery</option>
              <option value="projects">Projects</option>
              <option value="pdfs">PDFs</option>
            </select>
          </div>

          <div class="form-row">
            <label>Description</label>
            <input v-model="uploadForm.description" placeholder="Optional description">
          </div>

          <div class="form-row">
            <label>Tags (comma separated)</label>
            <input v-model="uploadForm.tags" placeholder="tag1, tag2, tag3">
          </div>

          <div class="file-input">
            <input 
              ref="fileInput"
              type="file" 
              :multiple="uploadType.includes('multiple')"
              :accept="getAcceptType()"
              @change="handleFileSelect"
            >
          </div>

          <div v-if="selectedFiles.length" class="selected-files">
            <h4>Selected Files:</h4>
            <div v-for="(file, index) in selectedFiles" :key="index" class="selected-file">
              <span>{{ file.name }} ({{ formatFileSize(file.size) }})</span>
              <button @click="removeSelectedFile(index)">×</button>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn primary" @click="uploadFiles" :disabled="!selectedFiles.length || uploading">
            {{ uploading ? 'Uploading...' : 'Upload' }}
          </button>
          <button class="btn" @click="closeUploadModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- File Details Modal -->
    <div v-if="selectedFile" class="modal">
      <div class="modal-content large">
        <h3>File Details</h3>
        
        <div class="file-details">
          <div class="file-preview-large">
            <img 
              v-if="isImage(selectedFile)" 
              :src="getFileUrl(selectedFile.url)" 
              :alt="selectedFile.originalName"
            >
            <div v-else class="file-icon-large">
              {{ getFileIcon(selectedFile.mimetype) }}
            </div>
          </div>
          
          <div class="file-metadata">
            <div class="metadata-row">
              <label>File Name:</label>
              <span>{{ selectedFile.originalName }}</span>
            </div>
            <div class="metadata-row">
              <label>Size:</label>
              <span>{{ formatFileSize(selectedFile.size) }}</span>
            </div>
            <div class="metadata-row">
              <label>Type:</label>
              <span>{{ selectedFile.mimetype }}</span>
            </div>
            <div class="metadata-row">
              <label>Category:</label>
              <span>{{ selectedFile.category }}</span>
            </div>
            <div class="metadata-row">
              <label>Uploaded:</label>
              <span>{{ formatDate(selectedFile.createdAt) }}</span>
            </div>
            <div class="metadata-row">
              <label>URL:</label>
              <input 
                :value="getFileUrl(selectedFile.url)" 
                readonly 
                @click="$event.target.select()"
              >
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn" @click="copyFileUrl(selectedFile)">Copy URL</button>
          <button class="btn" @click="downloadFile(selectedFile)">Download</button>
          <button class="btn" @click="selectedFile = null">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import fileService from '../../../../services/fileService';

const userStore = useUserStore();

// Reactive data
const files = ref([]);
const stats = ref(null);
const selectedFile = ref(null);
const showUploadModal = ref(false);
const uploading = ref(false);
const selectedFiles = ref([]);
const searchTerm = ref('');
const showDeleted = ref(false);

const filters = reactive({
  category: '',
  page: 1,
  limit: 20,
});

const pagination = reactive({
  page: 1,
  pages: 1,
  total: 0,
});

const uploadType = ref('single-image');
const uploadForm = reactive({
  category: 'general',
  description: '',
  tags: '',
});

// Computed
const fileInput = ref(null);

// Methods
async function fetchFiles() {
  try {
    const query = {
      ...filters,
      isActive: !showDeleted.value,
    };
    
    if (searchTerm.value) {
      // Add search logic if backend supports it
    }

    const response = await fileService.getFiles(userStore.getToken, query);
    files.value = response.files;
    Object.assign(pagination, response.pagination);
  } catch (error) {
    console.error('Error fetching files:', error);
  }
}

async function fetchStats() {
  try {
    stats.value = await fileService.getFileStats(userStore.getToken);
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}

function refreshFiles() {
  fetchFiles();
  fetchStats();
}

function selectFile(file) {
  selectedFile.value = file;
}

function handleFileSelect(event) {
  selectedFiles.value = Array.from(event.target.files);
}

function removeSelectedFile(index) {
  selectedFiles.value.splice(index, 1);
}

function getAcceptType() {
  switch (uploadType.value) {
    case 'single-image':
    case 'multiple-images':
    case 'project-image':
      return 'image/*';
    case 'single-pdf':
      return 'application/pdf';
    default:
      return '*/*';
  }
}

async function uploadFiles() {
  if (!selectedFiles.value.length) return;
  
  uploading.value = true;
  try {
    const metadata = {
      category: uploadForm.category,
      description: uploadForm.description,
      tags: uploadForm.tags,
    };

    let response;
    if (uploadType.value === 'single-image') {
      response = await fileService.uploadImage(userStore.getToken, selectedFiles.value[0], metadata);
    } else if (uploadType.value === 'multiple-images') {
      response = await fileService.uploadMultipleImages(userStore.getToken, selectedFiles.value, metadata);
    } else if (uploadType.value === 'single-pdf') {
      response = await fileService.uploadPDF(userStore.getToken, selectedFiles.value[0], metadata);
    } else if (uploadType.value === 'project-image') {
      response = await fileService.uploadProjectImage(userStore.getToken, selectedFiles.value[0], metadata);
    }

    closeUploadModal();
    refreshFiles();
  } catch (error) {
    console.error('Error uploading files:', error);
    alert('Error uploading files: ' + error.message);
  } finally {
    uploading.value = false;
  }
}

function closeUploadModal() {
  showUploadModal.value = false;
  selectedFiles.value = [];
  uploadForm.description = '';
  uploadForm.tags = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

async function deleteFile(file) {
  const confirmed = confirm(
    file.isActive 
      ? `Delete "${file.originalName}"? This will move it to trash.`
      : `Permanently delete "${file.originalName}"? This cannot be undone.`
  );
  
  if (!confirmed) return;

  try {
    await fileService.deleteFile(userStore.getToken, file._id, !file.isActive);
    refreshFiles();
  } catch (error) {
    console.error('Error deleting file:', error);
    alert('Error deleting file: ' + error.message);
  }
}

async function restoreFile(file) {
  try {
    await fileService.restoreFile(userStore.getToken, file._id);
    refreshFiles();
  } catch (error) {
    console.error('Error restoring file:', error);
    alert('Error restoring file: ' + error.message);
  }
}

function copyFileUrl(file) {
  const url = getFileUrl(file.url);
  navigator.clipboard.writeText(url).then(() => {
    alert('URL copied to clipboard!');
  });
}

function downloadFile(file) {
  const url = getFileUrl(file.url);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.originalName;
  a.click();
}

function changePage(page) {
  filters.page = page;
  fetchFiles();
}

// Helper functions
function isImage(file) {
  return file.mimetype.startsWith('image/');
}

function getFileUrl(url) {
  return fileService.getFileUrl(url.replace('/uploads/', ''));
}

function getFileIcon(mimetype) {
  if (mimetype.includes('pdf')) return '📄';
  if (mimetype.includes('word')) return '📝';
  if (mimetype.includes('excel')) return '📊';
  if (mimetype.includes('text')) return '📃';
  return '📁';
}

function formatFileSize(bytes) {
  return fileService.formatFileSize(bytes);
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncateFileName(name, maxLength = 20) {
  return name.length > maxLength ? name.slice(0, maxLength - 3) + '...' : name;
}

function handleImageError(event) {
  event.target.src = '/path/to/placeholder-image.png';
}

let searchTimeout;
function debounceSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchFiles();
  }, 300);
}

// Lifecycle
onMounted(() => {
  refreshFiles();
});
</script>

<style scoped>
.file-manager {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filters {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.search-input {
  flex: 1;
  max-width: 300px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat {
  text-align: center;
  padding: 15px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 5px;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.file-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.file-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.file-card.deleted {
  opacity: 0.6;
  border-color: #ff6b6b;
}

.file-preview {
  height: 120px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.file-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-icon {
  font-size: 48px;
}

.file-info {
  padding: 10px;
}

.file-name {
  font-weight: 600;
  margin-bottom: 5px;
  word-break: break-word;
}

.file-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.file-category {
  font-size: 11px;
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 12px;
  display: inline-block;
}

.file-actions {
  display: flex;
  padding: 8px;
  background: #f8f9fa;
  gap: 5px;
}

.action-btn {
  padding: 4px 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

.action-btn:hover {
  background: #e0e0e0;
}

.action-btn.danger:hover {
  background: #ffebee;
  color: #d32f2f;
}

.action-btn.success:hover {
  background: #e8f5e8;
  color: #2e7d32;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 800px;
}

.upload-section {
  margin: 20px 0;
}

.upload-type {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.upload-type label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-row label {
  font-weight: 600;
  margin-bottom: 5px;
}

.form-row input,
.form-row select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.file-input {
  margin: 15px 0;
}

.selected-files {
  margin-top: 15px;
}

.selected-file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 5px;
}

.selected-file button {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.file-details {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.file-preview-large {
  flex: 1;
  max-width: 300px;
}

.file-preview-large img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.file-icon-large {
  font-size: 72px;
  text-align: center;
  padding: 50px;
  background: #f8f9fa;
  border-radius: 8px;
}

.file-metadata {
  flex: 1;
}

.metadata-row {
  display: flex;
  margin-bottom: 10px;
}

.metadata-row label {
  font-weight: 600;
  min-width: 100px;
}

.metadata-row input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn.primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .files-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .file-details {
    flex-direction: column;
  }
}
</style>