import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router/index.ts'

import '@/assets/base.css'
import '@/assets/auth.css'
import '@/assets/list.css'
import '@/assets/navbar.css'
import '@/assets/ticket.css'

import { initUser } from "@/modules/user/composables/useInitUser.ts";

const bootstrap = async () => {
    const app = createApp(App)

    await initUser()

    app.use(router)
    app.mount('#app')
}

bootstrap()