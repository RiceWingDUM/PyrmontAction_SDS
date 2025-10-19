<template>
    <div>
        <h1>Completed Events</h1>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="event in eventList" :key="event._id">
                    <td>{{ formatDate(event.startDate) }}</td>
                    <td>{{ event.title }}</td>
                    <td>{{ event.location }}</td>
                    <td><button @click="selectedEvent = event">View</button></td>
                </tr>
            </tbody>
        </table>

        <ViewEvents 
            v-if="selectedEvent" 
            :event="selectedEvent" 
            @close="selectedEvent = null"
        />
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import ViewEvents from './ViewEvents.vue';

const props = defineProps({
  completed: {
    type: Array,
    required: true,
  }
});

const eventList = ref([]);
const selectedEvent = ref(null);

watch(() => props.completed, (newData) => {
    eventList.value = newData;
    console.log('Received completed events data:', eventList.value);
}, { immediate: true });

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

const startTime = (startDate) => {
    return new Date(startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
const endTime = (endDate) => {
    return new Date(endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>


<style scoped>
/* Add your styles here */
</style>