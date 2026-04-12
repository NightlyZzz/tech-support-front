import { reactive, ref } from 'vue'
import router from '@/router'
import { login } from '@/modules/user/api/auth.api'
import { getLaravelErrorMessage } from '@/modules/user/helpers/getLaravelErrorMessage'
import { initializeAuthorizedSession } from '@/modules/user/services/session.service'
import { showToast } from '@/shared/toast/toastService'
import type { LoginForm } from '@/modules/user/types/auth'

export const useLoginForm = () => {
    const form = reactive<LoginForm>({
        email: '',
        password: '',
        remember: false
    })

    const showPassword = ref(false)
    const isSubmitting = ref(false)

    const handleLogin = async (): Promise<void> => {
        if (isSubmitting.value) {
            return
        }

        isSubmitting.value = true

        try {
            await login({
                email: form.email.trim().toLowerCase(),
                password: form.password,
                remember: form.remember
            })

            await initializeAuthorizedSession()
            await router.replace({ name: 'profile' })
        } catch (error: unknown) {
            const errorMessage = getLaravelErrorMessage(error)
            showToast(errorMessage ?? 'Неверный email или пароль', 'error')
        } finally {
            isSubmitting.value = false
        }
    }

    return {
        form,
        showPassword,
        isSubmitting,
        handleLogin
    }
}