
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead, useHead } from '@vueuse/head';
import { permissionDirective } from './directives/permission'
import router from './router';
import App from './App.vue';
import './main.css';

import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);

/**
 * 1. Vue-Level Error Handler
 * Catches errors during component render, watchers, and lifecycle hooks.
 */
app.config.errorHandler = (err, instance, info) => {
  console.error("Vue Global Error:", err, info);
  
  router.push({
    name: '500',
    query: { 
      message: 'Application Crash',
      reason: 'A critical rendering error occurred. Our team has been notified.' 
    }
  });
};

/**
 * 2. Async/Promise Error Handler
 * Catches unhandled rejections (e.g., failed Firestore shards or Auth timeouts).
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error("Unhandled Promise Rejection:", event.reason);
  
  router.push({
    name: '500',
    query: { 
      message: 'Server Error',
      reason: 'Our systems are experiencing a hiccup.' 
    }
  });
});

const head = createHead();
app.use(createPinia());

app.use(head)

// Register the global directive as v-permission
app.directive('permission', permissionDirective)

app.use(router);

app.mount('#app');
