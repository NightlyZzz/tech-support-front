import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router/index.ts'

import '@/assets/base.css'
import '@/assets/auth.css'
import '@/assets/list.css'
import '@/assets/navbar.css'
import '@/assets/ticket.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
