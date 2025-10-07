<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-1">Admin Dashboard</h1>
    <p class="text-gray-600 mb-4">Welcome to the admin dashboard page.</p>

    <!-- Tab buttons -->
    <div class="tabs">
      <button
        v-for="t in tabs"
        :key="t.key"
        class="tab"
        :class="{ active: activeTab === t.key }"
        @click="activeTab = t.key"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Conditional rendering of each section -->
    <div class="mt-4">
      <div v-if="activeTab === 'account'">
        <p>This is content for My Account tab.</p>
      </div>

      <div v-else-if="activeTab === 'minutes'">
        <MeetingMinutesAdmin />
      </div>

      <div v-else-if="activeTab === 'calendar'">
        <EventCalendarAdmin />
      </div>

      <div v-else-if="activeTab === 'manager'">
        <p>This is content for Account Manager tab.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MeetingMinutesAdmin from '../components/admin/MeetingMinutesAdmin.vue'
import EventCalendarAdmin from '../components/admin/EventCalendarAdmin.vue' // ← add this import

const tabs = [
  { key: 'account',  label: 'My Account' },
  { key: 'minutes',  label: 'Meeting Minutes' },
  { key: 'calendar', label: 'Event Calendar' },   // ← new tab
  { key: 'manager',  label: 'Account Manager' },
]

// Change default tab here if you want:
const activeTab = ref('account') // e.g. 'minutes' to open Minutes by default
</script>

<style scoped>
.tabs { display: flex; gap: 6px; margin-bottom: 12px; }
.tab { border: 1px solid #d1d5db; background: #fff; border-radius: 6px; padding: 6px 12px; cursor: pointer; font-size: 14px; }
.tab.active { background: #111; color: #fff; border-color: #111; }
</style>
