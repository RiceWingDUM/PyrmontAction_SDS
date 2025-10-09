<template>
  <div class="file-upload-component">
    <div class="upload-area" 
         :class="{ 'drag-over': isDragOver, 'has-files': selectedFiles.length }"
         @click="triggerFileInput"
         @drop="handleDrop"
         @dragover="handleDragOver"
         @dragleave="handleDragLeave">
      
      <input 
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="handleFileSelect"
        style="display: none"
      >

      <div v-if="!selectedFiles.length" class="upload-prompt">
        <div class="upload-icon">📁</div>
        <p>{{ multiple ? 'Click to select files or drag and drop' : 'Click to select a file or drag and drop' }}</p>
        <p class="upload-hint">{{ getHintText() }}</p>
      </div>

      <div v-else class="selected-files-preview">
        <h4>Selected Files:</h4>
        <div class="files-list">
          <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
            <div class="file-preview">
              <img v-if="isImage(file)" :src="getPreviewUrl(file)" alt="Preview">
              <div v-else class="file-icon">{{ getFileIcon(file.type) }}</div>
            </div>
            <div class="file-info">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-size">{{ formatFileSize(file.size) }}</div>
            </div>
            <button class="remove-btn" @click.stop="removeFile(index)">×</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="selectedFiles.length" class="upload-controls">
      <button class="btn" @click="clearFiles">Clear All</button>
      <button class="btn primary" @click="uploadFiles" :disabled="uploading">
        {{ uploading ? 'Uploading...' : 'Upload Files' }}
      </button>
    </div>

    <div v-if="uploading" class="upload-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
      <p>{{ uploadStatus }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import fileService from '../../../services/fileService';

const props = defineProps({
  accept: {
    type: String,
    default: 'image/*,application/pdf'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  maxFileSize: {
    type: Number,
    default: 5 // MB
  },
  category: {
    type: String,
    default: 'general'
  },
  uploadType: {
    type: String,
    default: 'single-image' // single-image, multiple-images, single-pdf, project-image
  }
});

const emits = defineEmits(['upload-success', 'upload-error', 'files-selected']);

const fileInput = ref(null);
const selectedFiles = ref([]);
const isDragOver = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref('');
const error = ref('');

function triggerFileInput() {
  fileInput.value.click();
}

function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  processFiles(files);
}

function handleDrop(event) {
  event.preventDefault();
  isDragOver.value = false;
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
}

function handleDragOver(event) {
  event.preventDefault();
  isDragOver.value = true;
}

function handleDragLeave(event) {
  event.preventDefault();
  isDragOver.value = false;
}

function processFiles(files) {
  error.value = '';
  
  // Validate files
  const validFiles = [];
  for (const file of files) {
    if (!validateFile(file)) {
      continue;
    }
    validFiles.push(file);
  }

  if (props.multiple) {
    selectedFiles.value = [...selectedFiles.value, ...validFiles];
  } else {
    selectedFiles.value = validFiles.slice(0, 1);
  }

  emits('files-selected', selectedFiles.value);
}

function validateFile(file) {
  // Check file size
  if (!fileService.validateFileSize(file, props.maxFileSize)) {
    error.value = `File "${file.name}" is too large. Maximum size is ${props.maxFileSize}MB.`;
    return false;
  }

  // Check file type based on accept prop
  if (props.accept !== '*/*') {
    const acceptedTypes = props.accept.split(',').map(type => type.trim());
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    });

    if (!isValidType) {
      error.value = `File "${file.name}" is not an accepted file type.`;
      return false;
    }
  }

  return true;
}

function removeFile(index) {
  selectedFiles.value.splice(index, 1);
  emits('files-selected', selectedFiles.value);
}

function clearFiles() {
  selectedFiles.value = [];
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  emits('files-selected', selectedFiles.value);
}

async function uploadFiles() {
  if (!selectedFiles.value.length) return;

  uploading.value = true;
  uploadProgress.value = 0;
  error.value = '';

  try {
    const metadata = {
      category: props.category,
    };

    let result;
    uploadStatus.value = 'Uploading files...';

    if (props.uploadType === 'single-image') {
      result = await fileService.uploadImage(
        // Need to get token from user store - you'll need to inject this
        '', 
        selectedFiles.value[0], 
        metadata
      );
    } else if (props.uploadType === 'multiple-images') {
      result = await fileService.uploadMultipleImages('', selectedFiles.value, metadata);
    } else if (props.uploadType === 'single-pdf') {
      result = await fileService.uploadPDF('', selectedFiles.value[0], metadata);
    } else if (props.uploadType === 'project-image') {
      result = await fileService.uploadProjectImage('', selectedFiles.value[0], metadata);
    }

    uploadProgress.value = 100;
    uploadStatus.value = 'Upload complete!';
    
    emits('upload-success', result);
    clearFiles();
    
    setTimeout(() => {
      uploading.value = false;
      uploadProgress.value = 0;
      uploadStatus.value = '';
    }, 2000);

  } catch (err) {
    console.error('Upload error:', err);
    error.value = 'Upload failed: ' + err.message;
    emits('upload-error', err);
    uploading.value = false;
    uploadProgress.value = 0;
    uploadStatus.value = '';
  }
}

function isImage(file) {
  return file.type.startsWith('image/');
}

function getPreviewUrl(file) {
  return URL.createObjectURL(file);
}

function getFileIcon(mimeType) {
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel')) return '📊';
  if (mimeType.includes('text')) return '📃';
  return '📁';
}

function formatFileSize(bytes) {
  return fileService.formatFileSize(bytes);
}

function getHintText() {
  if (props.accept.includes('image')) {
    return `Maximum ${props.maxFileSize}MB per image`;
  } else if (props.accept.includes('pdf')) {
    return `Maximum ${props.maxFileSize}MB per PDF`;
  }
  return `Maximum ${props.maxFileSize}MB per file`;
}
</script>

<style scoped>
.file-upload-component {
  width: 100%;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #3b82f6;
  background: #eff6ff;
}

.upload-area.has-files {
  border-color: #10b981;
  background: #f0fdf4;
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-hint {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.selected-files-preview {
  text-align: left;
}

.selected-files-preview h4 {
  margin-bottom: 15px;
  color: #374151;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.file-preview {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.file-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-icon {
  font-size: 20px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: #374151;
  word-break: break-word;
}

.file-size {
  font-size: 12px;
  color: #6b7280;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
}

.remove-btn:hover {
  background: #dc2626;
}

.error-message {
  color: #ef4444;
  background: #fee2e2;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 14px;
}

.upload-controls {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.upload-progress {
  margin-top: 15px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn.primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.btn:hover {
  background: #f3f4f6;
}

.btn.primary:hover {
  background: #2563eb;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .upload-area {
    padding: 20px;
  }
  
  .file-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .remove-btn {
    align-self: flex-end;
  }
}
</style>