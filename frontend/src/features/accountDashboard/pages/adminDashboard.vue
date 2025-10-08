<template>
  <div class="admin-dashboard-bg">
    <div class="admin-dashboard-container">
      <div class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Admin Dashboard</h1>
          <p class="dashboard-desc">Welcome to the admin dashboard page.</p>
        </div>
        <button class="editorial-btn" @click="$router.push('/editorial-dashboard')">
          Editorial
        </button>
      </div>
      <!-- Tab buttons -->
      <div class="tabs">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="tab"
          :class="{ active: activeTab === t.key }"
          @click="activeTab = t.key"
        >
          <span class="tab-icon">{{ t.icon }}</span>
          {{ t.label }}
        </button>
      </div>
      <!-- Tab content in a card -->
      <div class="tab-card">
        <div v-if="activeTab === 'account'">
          <h2 class="section-title">My Account</h2>
          <p>This is content for My Account tab.</p>
        </div>
        <div v-else-if="activeTab === 'minutes'">
          <h2 class="section-title">Meeting Minutes</h2>
          <MeetingMinutesAdmin />
        </div>
        <div v-else-if="activeTab === 'calendar'">
          <h2 class="section-title">Event Calendar</h2>
          <EventCalendarAdmin />
        </div>
        <div v-else-if="activeTab === 'manager'">
          <h2 class="section-title">Account Manager</h2>
          <p>This is content for Account Manager tab.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MeetingMinutesAdmin from '../components/admin/MeetingMinutesAdmin.vue'
import EventCalendarAdmin from '../components/admin/EventCalendarAdmin.vue'

const tabs = [
  { key: 'account',  label: 'My Account', icon: '👤' },
  { key: 'minutes',  label: 'Meeting Minutes', icon: '📝' },
  { key: 'calendar', label: 'Event Calendar', icon: '📅' },
  { key: 'manager',  label: 'Account Manager', icon: '🛠️' },
]
const activeTab = ref('account')
</script>

<style scoped>
.admin-dashboard-bg {
  background: #f7f8fa;
  min-height: 100vh;
  padding-top: 32px;
}
.admin-dashboard-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.dashboard-desc {
  color: #666;
  margin-bottom: 0;
}
.editorial-btn {
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;
}
.editorial-btn:hover {
  background: #155a8a;
}
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}
.tab {
  border: 1px solid #d1d5db;
  background: #fff;
  border-radius: 8px 8px 0 0;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 15px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s, color 0.2s;
}
.tab.active {
  background: #1976d2;
  color: #fff;
  border-bottom: 2px solid #1976d2;
  font-weight: 600;
}
.tab-icon {
  font-size: 1.2em;
}
.tab-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(60,60,90,0.08);
  padding: 32px 28px;
  min-height: 200px;
}
.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 18px;
}
</style>
