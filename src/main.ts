// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { type PluginOptions } from 'vue-toastification'

import App from './App.vue'
import router from './router'

// Styles
import './assets/styles/main.css'
import './assets/styles/animations.css'
import './assets/styles/responsive.css'

// FontAwesome
import '@fortawesome/fontawesome-free/css/all.min.css'

// Toast Notification
import 'vue-toastification/dist/index.css'

// Animate.css (Optional)
import 'animate.css'

// Toast 옵션
const toastOptions: PluginOptions = {
  //position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
  transition: 'Vue-Toastification__fade',
  maxToasts: 3,
  newestOnTop: true
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)

app.mount('#app')
