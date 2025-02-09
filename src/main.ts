import './assets/css/satoshi.css'
import './assets/css/style.css'
import 'jsvectormap/dist/css/jsvectormap.min.css'
import 'flatpickr/dist/flatpickr.min.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/Lara';
import ToastService from 'primevue/toastservice';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueApexCharts)
app.use(ToastPlugin);
app.use(ToastService);
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            darkModeSelector: false,
        },
    }
});

app.mount('#app')
