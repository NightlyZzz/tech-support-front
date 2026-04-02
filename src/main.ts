import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router/index.ts'
import { initUser } from '@/user/data'

import '@/assets/base.css'
import '@/assets/auth.css'
import '@/assets/list.css'
import '@/assets/navbar.css'
import '@/assets/ticket.css'

const app = createApp(App)

initUser()
app.use(router)
app.mount('#app')
