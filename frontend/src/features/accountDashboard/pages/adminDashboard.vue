<template>
  <div class="page">
    <main class="container content">
      <!-- Hero -->
      <section class="hero">
        <h1 class="hero__title">Admin Dashboard</h1>
        <p class="hero__sub">Welcome to the admin dashboard page.</p>
      </section>

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
      <div class="tab-content">
        <div v-if="activeTab === 'account'">
          <AccountDetailsComponent 
            v-if="userData"
            :userData="userData"
            @userUpdated="handleUserUpdated"
          />
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
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../../stores/authStore'
import services from '../accountServices'
import MeetingMinutesAdmin from '../components/admin/MeetingMinutesAdmin.vue'
import EventCalendarAdmin from '../components/admin/EventCalendarAdmin.vue'
import AccountDetailsComponent from '../components/AccountDetailsComponent.vue'

const router = useRouter()
const userStore = useUserStore()
const userData = ref(null)

// Load user data on mount
onMounted(async () => {
  try {
    if (!userStore.isAuthenticated) {
      console.warn('User not authenticated, redirecting to login.')
      logout()
      return
    }

    const response = await services.getCurrentUserDetails(userStore.getToken)
    userData.value = response
  } catch (error) {
    console.error('Failed to load admin data:', error)
    logout()
  }
})

const logout = async () => {
  userStore.logout()
  await router.push('/login')
}

function handleUserUpdated(updatedUserData) {
  userData.value = updatedUserData
  console.log('User updated successfully:', updatedUserData)
}

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
/* page + container */
.page { background:#f9fafb; min-height:100vh; color:#0f172a; }
.container { max-width:1080px; margin:0 auto; padding:28px 20px 60px; }

/* hero */
.hero__title{ font-size:clamp(28px,4vw,48px); font-weight:800; margin:0; }
.hero__sub{ margin:6px 0 20px; color:#6b7280; }

/* tabs */
.tabs { 
  display: flex; 
  gap: 6px; 
  margin-bottom: 24px; 
}
.tab { 
  border: 1px solid #d1d5db; 
  background: #fff; 
  border-radius: 8px; 
  padding: 10px 16px; 
  cursor: pointer; 
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}
.tab:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}
.tab.active { 
  background: #111; 
  color: #fff; 
  border-color: #111; 
}

/* tab content */
.tab-content {
  margin-top: 8px;
}
</style>
