import { onMounted, reactive, ref } from 'vue'
import router from '@/router'
import { register } from '@/modules/user/api/auth.api'
import { getAllDepartments } from '@/modules/user/api/user.lookup'
import { getLaravelErrorMessage } from '@/modules/user/helpers/getLaravelErrorMessage'
import { initializeAuthorizedSession } from '@/modules/user/services/session.service'
import { showToast } from '@/shared/toast/toastService'
import type { Department } from '@/modules/user/types/department'
import type { RegisterForm, RegisterRequest } from '@/modules/user/types/register'

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
    const isSubmitting = ref(false)

    const updateDepartmentId = (value: number | null) => {
        form.department_id = value
    }

    const loadDepartments = async (): Promise<void> => {
        try {
            const departmentsResponse = await getAllDepartments()
            departments.value = departmentsResponse.data ?? []
        } catch {
            departments.value = []
        }
    }

    const buildRegisterPayload = (): RegisterRequest | null => {
        if (form.department_id === null) {
            return null
        }

        return {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            middle_name: form.middle_name.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            department_id: form.department_id,
            remember: form.remember
        }
    }

    const handleRegister = async (): Promise<void> => {
        if (isSubmitting.value) {
            return
        }

        if (form.password.length < 8) {
            showToast('Пароль должен содержать не менее 8 символов', 'error')
            return
        }

        const registerPayload = buildRegisterPayload()

        if (registerPayload === null) {
            showToast('Выберите подразделение', 'error')
            return
        }

        isSubmitting.value = true

        try {
            await register(registerPayload)

            await initializeAuthorizedSession()
            await router.replace({ name: 'profile' })
        } catch (error: unknown) {
            const errorMessage = getLaravelErrorMessage(error)
            showToast(errorMessage ?? 'Ошибка регистрации', 'error')
        } finally {
            isSubmitting.value = false
        }
    }

    onMounted(loadDepartments)

    return {
        form,
        showPassword,
        departments,
        isSubmitting,
        updateDepartmentId,
        handleRegister
    }
}