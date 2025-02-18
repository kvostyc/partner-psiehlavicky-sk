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

import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

// Pusher.js
import Pusher from 'pusher-js'
Pusher.logToConsole = true;
const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    cluster: import.meta.env.VITE_PUSHER_CLUSTER,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueApexCharts)
app.use(ToastPlugin)
app.use(ToastService)
app.use(PrimeVue, {
    theme: {
        options: {
            darkModeSelector: false
        }
    }
})

app.config.globalProperties.$pusher = pusher

app.mount('#app')
