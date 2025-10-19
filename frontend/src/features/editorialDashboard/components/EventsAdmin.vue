<template>
    <div>
        <div>
            <button @click="currentTab = 'upcoming'">Upcoming</button>
            <button @click="currentTab = 'completed'">Completed</button>
        </div>
        <div v-if="currentTab === 'upcoming'">
            <UpcomingEvents />
        </div>
        <div v-if="currentTab === 'completed'">
            <CompletedEvents 
            :completed="completedList"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { useUserStore } from '../../../stores/authStore';
import services from '../editorialServices';
import EditGalleryItemAdmin from './EditGalleryItemAdmin.vue';
import CompletedEvents from './EventsCompletedAdmin.vue';
import UpcomingEvents from './EventsUpcomingAdmin.vue';

const props = defineProps({
  eventsData: {
    type: Object,
    required: true,
  }
});

const emits = defineEmits(['eventsUpdated']);
const upcomingList = ref([]);
const completedList = ref([]);
const currentTab = ref('upcoming');
const newItem = ref({ _id: null, caption: '', alt: '', image_file_name: '' });
const selectedGalleryItem = ref(null);
const fileInput = ref(null);

watch(() => props.eventsData, (newData) => {
    upcomingList.value = newData.upcoming;
    completedList.value = newData.completed;
    console.log('Received events data:', { upcoming: upcomingList.value, completed: completedList.value });
}, { immediate: true });

onUnmounted(() => {
  upcomingList.value = [];
  completedList.value = [];
});



function updateCompletedEvents(updatedEvents) {
    const index = completedList.value.findIndex(i => i._id === updatedEvents._id);
    if (index !== -1) {
        completedList.value[index] = { ...completedList.value[index], ...updatedEvents };
    }
    emits('eventsUpdated', { completed: completedList.value });
}



// async function addNewItem() {
//     try {
//         const formData = new FormData();
//         formData.append('caption', newItem.value.caption);
//         formData.append('alt', newItem.value.alt);
        
//         if (fileInput.value.files[0]) {
//             formData.append('file', fileInput.value.files[0]);
//         } else {
//             alert('Please select an image file.');
//             return;
//         }

//         const response = await services.uploadGalleryImage(useUserStore().getToken, formData);

//         const newGalleryItem = {
//             ... newItem.value,
//             _id: response._id,
//             image_file_name: response.image_file_name,
//         };

//         imageList.value.unshift(newGalleryItem);
//         emits('galleryUpdated', imageList.value);
//         clearItem();
//     } catch (error) {
//         console.error('Failed to add new gallery item:', error);
//     }
        
// }


// async function deleteItem(id) {
//     try {
//         if (confirm('Are you sure you want to delete this project?')) {
//             await services.deleteGalleryImage(useUserStore().getToken, id);
//       imageList.value = imageList.value.filter(p => p._id !== id);
//       emits('galleryUpdated', imageList.value);
//     }
//   } catch (error) {
//     console.error('Failed to delete gallery item:', error);
//   };
// }

// function clearItem() {
//     newItem.value = { _id: null, caption: '', alt: '', image_file_name: '' };
//     fileInput.value.value = '';
//     console.log('Cleared new item form.');
// }

// // File Selection Handlers
// function chooseFile() {
//     const file = fileInput.value.files[0];
//     newItem.value.image_file_name = file.name;
// }

// // Edit Modal Functions

// function editItem(item) {
//     selectedGalleryItem.value = item;
//     console.log('Editing item:', selectedGalleryItem.value);
// }
// function closeEditModalItem(item) {
//     selectedGalleryItem.value = null;
// }
// // Used by the emit in the editing component to update the item in the list
// function updateGalleryItem(updatedItem) {
//     const index = imageList.value.findIndex(i => i._id === updatedItem._id);
//     if (index !== -1) {
//         imageList.value[index] = { ...imageList.value[index], ...updatedItem };
//     }
//     emits('galleryUpdated', imageList.value);
// }

</script>


<style scoped>
/* Add your styles here */
</style>