<template>
  <div v-if="showEditModal" class="modal">
    <div class="modal-content">
      <h3>Edit Meeting Minute</h3>

      <div class="row">
        <label class="lbl">Title</label>
        <input v-model="editForm.title" class="input" placeholder="Enter title" />
      </div>

      <div class="row">
        <label class="lbl">Notes</label>
        <textarea v-model="editForm.note" class="input" rows="6" placeholder="Type the meeting notes…"></textarea>
      </div>

      <div class="row">
        <label class="lbl">Attach File</label>
        <div class="fileZone">
          <input ref="fileEl" type="file" accept="application/pdf" @change="chooseFile" />
          <div v-if="editForm.file" class="fileList">
            <span class="chip-name">📄 {{ editForm.file.name }}</span>
            <button class="chip-x" title="Remove" @click="removeFile">×</button>
          </div>
          <div v-else-if="editForm.filename" class="fileList">
            <span class="chip-name">📄 {{ editForm.filename }}</span>
            <button class="chip-x" title="Remove" @click="removeUploadedFile">×</button>
          </div>
          <div v-else class="hint">No file chosen</div>
        </div>
      </div>

      <div class="actions">
        <button class="btn primary" @click="saveEdit">Save</button>
        <button class="btn" @click="closeEditModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../dashboardServices';

const userStore = useUserStore();

const props = defineProps({
  meeting: {
    type: Object,
    required: true,
  }
});

const fileEl = ref(null);

const emits = defineEmits(['meetingUpdated', 'closeModal']);

const editForm = ref({
  _id: null,
  title: '',
  note: '',
  filename: "",
  isUploaded: false,
});

const showEditModal = computed(() => !!props.meeting);

// Watch for meeting prop changes
watch(() => props.meeting, (newMeeting) => {
  if (newMeeting) {
    editForm.value._id = newMeeting._id;
    editForm.value.title = newMeeting.title;
    editForm.value.note = newMeeting.note;
    editForm.value.filename = newMeeting.filename;
    editForm.value.isUploaded = newMeeting.isUploaded;
  }
}, { immediate: true });

function closeEditModal() {
  editForm.value = { _id: null, title: '', note: '', filename: "", isUploaded: false };
  fileEl.value.value = ''; // Reset the file input element
  emits('closeModal');
}

function chooseFile(e) {
  const file = e.target.files[0]; // Access the first file directly
  editForm.value.file = file; // Assign the single file to the form
  editForm.value.isUploaded = "false";
  console.log('File selected:', file); // Debug log
}

function removeFile() {
  if (fileEl.value) {
    fileEl.value.value = ''; // Reset the file input element
  }
  editForm.value.file = null;
}

function removeUploadedFile() {
  editForm.value.filename = "";
}

async function saveEdit() {
  try {
    const formData = new FormData();
    formData.append('title', editForm.value.title);
    formData.append('note', editForm.value.note);

    if (editForm.value.file && editForm.value.isUploaded === "false") {
      formData.append('file', editForm.value.file);
    }

    const response = await services.updateMeetingWithFile(userStore.getToken, editForm.value._id, formData);
    editForm.value.filename = response.filename || "";
    editForm.value.isUploaded = response.isUploaded || "false";
    emits('meetingUpdated', { ...editForm.value, ...response });
    closeEditModal();
  } catch (error) {
    console.error('Failed to save edit:', error);
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.hidden-input {
  display: none;
}
.fileZone {
  border: 1px dashed #d1d5db;
  border-radius: 10px;
  padding: 10px;
  background: #fff;
}
.fileList {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}
.chip-name {
  display: inline-block;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 2px 8px;
  margin-right: 6px;
  font-size: 12px;
}
.chip-x {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}
.hint {
  color: #6b7280;
}
</style>