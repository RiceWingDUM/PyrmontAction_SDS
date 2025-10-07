import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css'; // CSS framework 

const app = createApp(App);
const pinia = createPinia();

app.config.globalProperties.$axios = axios;
app.use(pinia);  // Install Pinia BEFORE router
app.use(router);
app.mount('#app');
