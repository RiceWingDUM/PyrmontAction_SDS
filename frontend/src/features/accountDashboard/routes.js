import memberDashboard from "./pages/memberDashboard.vue"
import adminDashboard from "./pages/adminDashboard.vue"
import MeetingMinutesMember from "./components/member/MeetingMinutesMember.vue" // ✅ add this line

export const accountRoutes = [
  {
    path: '/dashboard/member',
    name: 'memberDashboard',
    component: memberDashboard
  },

  {
    path: '/dashboard/admin',
    name: 'adminDashboard',
    component: adminDashboard
  },

  {
    path: '/dashboard/editor',
    name: 'editorDashboard',
    component: adminDashboard
  },

  // ✅ NEW ROUTE for the "View all" button
  {
    path: '/member/minutes',
    name: 'memberMinutes',
    component: MeetingMinutesMember
  }
]
