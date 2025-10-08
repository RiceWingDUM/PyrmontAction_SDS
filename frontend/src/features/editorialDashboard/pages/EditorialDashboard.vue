<template>
  <div class="editorial-dashboard-bg">
    <div class="editorial-dashboard">
      <aside class="sidebar">
        <nav>
          <button
            v-for="tab in tabs"
            :key="tab.name"
            :class="{ active: currentTab === tab.name }"
            @click="currentTab = tab.name"
          >
            <span class="icon" :style="{ color: tab.color }">{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </nav>
      </aside>
      <main class="main-content">
        <h2 class="page-title">Edit {{ currentTab }}</h2>
        <div class="card">
          <!-- Projects Tab -->
          <div v-if="currentTab === 'Projects'" class="projects-tab-layout">
            <!-- Project List View -->
            <div v-if="!showForm" class="projects-list-nav">
              <button class="add-btn" @click="addProject">+ New Project</button>
              <ul>
                <li v-for="proj in projects" :key="proj._id">
                  <div>
                    <strong>{{ proj.project_name }}</strong>
                    <div class="mini-date">{{ proj.project_date }}</div>
                  </div>
                  <div class="project-actions">
                    <button @click.stop="editProject(proj)">Edit</button>
                    <button @click.stop="deleteProject(proj._id)">Delete</button>
                  </div>
                </li>
              </ul>
            </div>
            <!-- Editorial Dashboard Form View -->
            <div v-else class="editor-projects-editor">
              <form class="editor-form" @submit.prevent="saveProject">
                <input
                  v-model="editingProject.project_name"
                  class="editor-title"
                  placeholder="Enter project title..."
                  required
                />
                <textarea
                  v-model="editingProject.project_description"
                  class="editor-description"
                  placeholder="Write your project description here..."
                  rows="8"
                  required
                ></textarea>
                <label class="editor-image-label">
                  <span>Upload Image</span>
                  <input type="file" @change="onImageChange" />
                </label>
                <div v-if="editingProject.project_image" class="editor-image-preview">
                  <img :src="editingProject.project_image" alt="Preview" />
                </div>
                <div class="editor-actions">
                  <button type="submit" class="save-btn">Save</button>
                  <button type="button" class="cancel-btn" @click="cancelEdit">Cancel</button>
                </div>
              </form>
            </div>
          </div>
          <div v-else class="placeholder">
            <p>Edit {{ currentTab }} content here.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tabs = [
  { name: 'Projects', label: 'Projects', icon: '📁', color: '#fbbf24' },
  // Removed News tab
  { name: 'Events', label: 'Events', icon: '📅', color: '#38bdf8' },
  { name: 'Gallery', label: 'Gallery', icon: '🖼️', color: '#f472b6' }
]
const currentTab = ref('Projects')

// Mock projects data
const projects = ref([
  {
    _id: '1',
    project_name: 'Metro West Station & 31 storey tower development',
    project_description: 'Ensuring Public built environment outcomes',
    project_type: 'open',
    project_image: 'metro_west_station.jpg',
    project_date: '2025-05-27'
  },
  {
    _id: '2',
    project_name: 'Schools and Education',
    project_description: 'New and better schools needed for Pyrmont',
    project_type: 'open',
    project_image: 'schools_and_education.jpg',
    project_date: '2025-05-27'
  }
])

const showForm = ref(false)
const editingProject = ref({
  _id: null,
  project_name: '',
  project_description: '',
  project_type: '',
  project_image: '',
  project_date: ''
})

function addProject() {
  editingProject.value = {
    _id: null,
    project_name: '',
    project_description: '',
    project_type: '',
    project_image: '',
    project_date: ''
  }
  showForm.value = true
}

function editProject(project) {
  editingProject.value = { ...project }
  showForm.value = true
}

function saveProject() {
  if (editingProject.value._id) {
    // Edit existing
    const idx = projects.value.findIndex(p => p._id === editingProject.value._id)
    if (idx !== -1) projects.value[idx] = { ...editingProject.value }
  } else {
    // Add new
    editingProject.value._id = Date.now().toString()
    projects.value.push({ ...editingProject.value })
  }
  showForm.value = false
}

function cancelEdit() {
  showForm.value = false
}

function deleteProject(id) {
  projects.value = projects.value.filter(p => p._id !== id)
}

function onImageChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      editingProject.value.project_image = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
.editorial-dashboard-bg {
  background: #f7f8fa;
  min-height: calc(100vh - 70px); /* adjust if your header is taller */
  padding-top: 32px;
}
.editorial-dashboard {
  display: flex;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 700px;
}
.sidebar {
  width: 180px;
  background: transparent;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.sidebar nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sidebar button {
  width: 90%;
  background: none;
  border: none;
  text-align: left;
  padding: 12px 18px;
  font-size: 1rem;
  color: #888;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s, color 0.2s;
}
.sidebar button.active {
  background: #fff;
  color: #222;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(60,60,90,0.04);
}
.icon {
  font-size: 1.3em;
}
.main-content {
  flex: 1;
  padding: 0 0 0 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.page-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 32px;
  margin-top: 0;
}
.card {
  /* Remove max-width and width! */
  background: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  max-width: none;
  width: auto;
}
.editor-projects-editor {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
}
.editor-form {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(60,60,90,0.10);
  padding: 40px 36px;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.editor-title {
  font-size: 2rem;
  font-weight: 700;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  padding: 12px 0;
  outline: none;
  background: transparent;
}
.editor-description {
  font-size: 1.15rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  resize: vertical;
  min-height: 140px;
  background: #f9f9f9;
}
.editor-image-label {
  font-weight: 500;
  color: #1976d2;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.editor-image-label input[type="file"] {
  margin-top: 8px;
}
.editor-image-preview img {
  width: 100%;
  max-width: 320px;
  border-radius: 8px;
  margin: 12px 0;
  box-shadow: 0 2px 8px rgba(60,60,90,0.10);
}
.editor-actions {
  display: flex;
  gap: 18px;
  margin-top: 10px;
}
.save-btn {
  background: #4fc3f7;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.save-btn:hover {
  background: #1976d2;
}
.cancel-btn {
  background: #eee;
  color: #333;
  border: none;
  border-radius: 6px;
  padding: 8px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.cancel-btn:hover {
  background: #ccc;
}
.placeholder {
  color: #888;
  font-size: 1.1rem;
  text-align: center;
  padding: 40px 0;
}
.projects-tab-layout {
  display: flex;
  gap: 48px;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}
.project-preview-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(60,60,90,0.10);
  padding: 48px 40px;
  min-width: 420px;
  max-width: 520px;
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.project-preview-simple {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(60,60,90,0.10);
  padding: 48px 40px;
  min-width: 420px;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}
.preview-label {
  color: #bfa76a;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 10px;
}
.preview-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
}
.preview-image {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  max-height: 260px;
  margin-bottom: 12px;
}
.preview-date {
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 12px;
}
.preview-description {
  font-size: 1.15rem;
  color: #222;
  line-height: 1.6;
}
.form-image-preview img {
  width: 100%;
  max-width: 320px;
  border-radius: 8px;
  margin: 12px 0;
}
.projects-list-nav {
  min-width: 340px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(60,60,90,0.10);
  padding: 32px 24px;
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.add-btn {
  background: #4fc3f7;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 18px 0;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 28px;
  width: 100%;
  transition: background 0.2s;
}
.add-btn:hover {
  background: #1976d2;
}
.projects-list-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.projects-list-nav li {
  padding: 22px 16px;
  border-radius: 14px;
  margin-bottom: 18px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: background 0.2s, border 0.2s;
  border: 2px solid transparent;
  background: #f7f8fa;
  font-size: 1.1rem;
}
.projects-list-nav li.selected {
  border: 2px solid #4fc3f7;
  background: #e3f2fd;
  font-weight: 700;
}
.project-actions button {
  margin-left: 6px;
  background: #eee;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.project-actions button:hover {
  background: #ccc;
}
.mini-date {
  color: #888;
  font-size: 1em;
  margin-top: 6px;
}
@media (max-width: 900px) {
  .editorial-dashboard {
    flex-direction: column;
    align-items: stretch;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 0 0 16px 0;
  }
  .sidebar nav {
    flex-direction: row;
    gap: 0;
  }
  .sidebar button {
    width: auto;
    padding: 12px 18px;
    border-radius: 8px 8px 0 0;
  }
  .main-content {
    padding: 0;
    align-items: stretch;
  }
  .card {
    max-width: 100%;
    margin: 0 auto;
  }
}
</style>