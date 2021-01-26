import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AppLayout from '@/layouts/AppLayout.vue';
import '@/assets/styles/scss/main.scss';

createApp(App)
  .use(store)
  .use(router)
  .component('AppLayout', AppLayout)
  .mount('#app');
