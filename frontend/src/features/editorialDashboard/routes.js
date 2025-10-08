export default [
  {
    path: '/editorial-dashboard',
    name: 'editorialDashboard', // <-- use this name in your guard
    component: () => import('./pages/EditorialDashboard.vue')
  }
]