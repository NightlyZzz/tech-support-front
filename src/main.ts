import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'

import '@/assets/base.css'
import '@/assets/auth.css'
import '@/assets/list.css'
import '@/assets/navbar.css'
import '@/assets/ticket.css'
import '@/assets/toast.css'

import { initUser } from '@/modules/user/composables/useInitUser'

const bootstrap = async (): Promise<void> => {
    try {
        await initUser()
    } catch (error) {
        console.error('Application bootstrap failed', error)
    }

    const application = createApp(App)

    application.use(router)

    await router.isReady()

    application.mount('#app')
}

void bootstrap()