import { onMounted, reactive, ref } from 'vue'
import router from '@/router'
import { register, login } from '@/modules/user/api/auth.api'
import { showToast } from '@/shared/toast/toastService'
import { setUserToken } from '@/modules/user/model/userStorage'
import { getAllDepartments } from '@/modules/user/api/user.lookup'
import { initUser } from '@/modules/user/composables/useInitUser'
import { createEcho, disconnectEcho } from '@/shared/realtime/echo'
import type { Department } from '@/modules/user/types/department'
import type { LaravelError, RegisterForm } from '@/modules/user/types/register'

export const useRegisterForm = () => {
    const form = reactive<RegisterForm>({
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        password: '',
        department_id: null,
        remember: false
    })

    const showPassword = ref(false)
    const departments = ref<Department[]>([])

    const updateDepartmentId = (value: number | null) => {
        form.department_id = value
    }

    const loadDepartments = async (): Promise<void> => {
        try {
            const departmentsResponse = await getAllDepartments()
            departments.value = departmentsResponse.data
        } catch {
        }
    }

    const handleRegister = async (): Promise<void> => {
        if (form.password.length < 8) {
            showToast('Пароль должен содержать не менее 8 символов', 'error')
            return
        }

        if (form.department_id === null) {
            showToast('Выберите подразделение', 'error')
            return
        }

        try {
            await register({
                first_name: form.first_name,
                last_name: form.last_name,
                middle_name: form.middle_name,
                email: form.email,
                password: form.password,
                department_id: form.department_id,
                remember: form.remember
            })

            const loginResponse = await login({
                email: form.email,
                password: form.password
            })

            setUserToken(loginResponse.token)

            disconnectEcho()
            createEcho()

            await initUser()
            await router.push({ name: 'home' })
        } catch (error: any) {
            if (error.response) {
                const laravelError = error.response.data as LaravelError

                if (laravelError.errors) {
                    const firstErrorMessage = Object.values(laravelError.errors)[0][0]
                    showToast(firstErrorMessage, 'error')
                    return
                }

                if (laravelError.message) {
                    showToast(laravelError.message, 'error')
                    return
                }
            }

            showToast('Ошибка регистрации', 'error')
        }
    }

    onMounted(loadDepartments)

    return {
        form,
        showPassword,
        departments,
        updateDepartmentId,
        handleRegister
    }
}