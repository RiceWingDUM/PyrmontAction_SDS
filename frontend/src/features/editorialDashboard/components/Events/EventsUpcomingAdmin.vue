<template>
    <div>
        <h1>Upcoming Events</h1>
        <button @click="isAdding = true">Create Event</button>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Time</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="event in upcomingList" :key="event._id">
                    <td>{{ formatDate(event.startDate) }}</td>
                    <td>{{ event.title }}</td>
                    <td>{{ event.status }}</td>
                    <td>{{ event.location }}</td>
                    <td>{{ timeRange(event.startDate, event.endDate) }}</td>
                    <td>
                        <button v-if="event.status !== 'published'" @click="handlePublish(event)">Publish</button>
                        <button @click="selectedEvent = event">Edit</button>
                        <button @click="handleDelete(event)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <AddEvents 
            v-if="isAdding"
            @close="isAdding = false"
        />
    </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { useUserStore } from '../../../../stores/authStore';
import services from '../../editorialServices';
import { formatDate, timeRange } from '../../../../utils/dateUtils';
import AddEvents from './AddEventsAdmin.vue';

const props = defineProps({
  upcoming: {
    type: Array,
    required: true,
  }
});

const emits = defineEmits(['update']);
const upcomingList = ref([]);
const isAdding = ref(false);

watch(() => props.upcoming, (newData) => {
    upcomingList.value = newData;
    console.log('Received upcoming events data:', upcomingList.value);
}, { immediate: true });

async function handlePublish(event) {
    try {
        if (!confirm('Are you sure you want to publish this event?')) {
            return;
        }

        await services.publishEvent(useUserStore().token, event._id);
        
        const index = upcomingList.value.findIndex(m => m._id === event._id);
        if (index !== -1) {
            upcomingList.value[index].status = 'published';
        }
        
        emits('update', upcomingList.value);
        
    } catch (error) {
        console.error('Failed to publish event:', error);
    }
}

async function handleDelete(event) {
    try {

        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }
        await services.deleteEvent(useUserStore().token, event._id);
        upcomingList.value = upcomingList.value.filter(m => m._id !== event._id);
        emits('update', upcomingList.value);
    } catch (error) {
        console.error('Failed to delete event:', error);
    }
}

</script>


<style scoped>
/* Add your styles here */
</style>