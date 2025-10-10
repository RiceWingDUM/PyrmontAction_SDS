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
  note: ''
});

const showEditModal = computed(() => !!props.meeting);

// Watch for meeting prop changes
watch(() => props.meeting, (newMeeting) => {
  if (newMeeting) {
    editForm.value._id = newMeeting._id;
    editForm.value.title = newMeeting.title;
    editForm.value.note = newMeeting.note;
  }
}, { immediate: true });

function closeEditModal() {
  editForm.value = { _id: null, title: '', note: '' };
  emits('closeModal');
}

async function saveEdit() {
  try {
    const response = await services.updateMeetingMinute(userStore.getToken, editForm.value._id, editForm.value);
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
</style>