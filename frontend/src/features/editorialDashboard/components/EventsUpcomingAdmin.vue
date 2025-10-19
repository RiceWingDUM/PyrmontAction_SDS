<template>
    <div>
        <h1>Upcoming Events</h1>
    </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { useUserStore } from '../../../stores/authStore';
import services from '../editorialServices';
import EditGalleryItemAdmin from './EditGalleryItemAdmin.vue';

</script>


<style scoped>
/* Add your styles here */
</style>