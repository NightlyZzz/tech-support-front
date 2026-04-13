import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { redirectToGoogleAuth } from '@/modules/user/services/auth.service'
import { showToast } from '@/shared/toast/toastService'

export type AuthMode = 'login' | 'register'

export const useAuthView = () => {
    const route = useRoute()
    const router = useRouter()
    const mode = ref<AuthMode>('login')
    const isProcessingGoogleAuth = ref(false)

    const isLogin = computed(() => mode.value === 'login')

    const title = computed(() => {
        return isLogin.value ? 'Добро пожаловать' : 'Создать аккаунт'
    })

    const subtitle = computed(() => {
        return isLogin.value
                ? 'Войдите, чтобы продолжить работу в системе'
                : 'Заполните данные для регистрации нового аккаунта'
    })

    const setMode = (value: AuthMode): void => {
        mode.value = value
    }

    const handleGoogleAuth = (): void => {
        if (isProcessingGoogleAuth.value) {
            return
        }

        redirectToGoogleAuth()
    }

    const handleGoogleCallbackError = async (): Promise<void> => {
        const provider = String(route.query.provider ?? '')
        const status = String(route.query.status ?? '')

        if (provider !== 'google' || status !== 'error') {
            return
        }

        await router.replace({ name: 'auth' })
        showToast('Не удалось выполнить вход через Google', 'error')
    }

    onMounted(handleGoogleCallbackError)

    return {
        isLogin,
        title,
        subtitle,
        isProcessingGoogleAuth,
        setMode,
        handleGoogleAuth
    }
}