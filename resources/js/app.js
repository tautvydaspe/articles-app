import './bootstrap.js';
import { createApp } from 'vue';

const app = createApp({});

import articles from './components/Articles.vue';
app.component('articles', articles);
import navbar from './components/Navbar.vue';
app.component('navbar', navbar);

app.mount('#app');
