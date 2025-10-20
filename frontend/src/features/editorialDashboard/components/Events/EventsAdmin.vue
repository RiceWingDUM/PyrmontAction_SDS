<template>
    <div>
        <div>
            <button @click="currentTab = 'upcoming'">Upcoming</button>
            <button @click="currentTab = 'completed'">Completed</button>
        </div>
        <div v-if="currentTab === 'upcoming'">
            <UpcomingEvents
                :upcoming="upcomingList"
                @update="updateUpcomingEvents"   
            />
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

watch(() => props.eventsData, (newData) => {
    upcomingList.value = newData.upcoming;
    completedList.value = newData.completed;
    console.log('Received events data:', { upcoming: upcomingList.value, completed: completedList.value });
}, { immediate: true });

onUnmounted(() => {
  upcomingList.value = [];
  completedList.value = [];
});



function updateUpcomingEvents(updatedEvent) {
    console.log('Updating upcoming events with:', updatedEvent);
    upcomingList.value.unshift(updatedEvent);
    emits('eventsUpdated', { upcoming: upcomingList.value });
}
</script>


<style scoped>
/* Add your styles here */
</style>