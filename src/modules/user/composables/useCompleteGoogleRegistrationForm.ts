import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { completeGoogleRegistration } from '@/modules/user/api/auth.api'
import { getAllDepartments } from '@/modules/user/api/user.lookup'
import { getLaravelErrorMessage } from '@/modules/user/helpers/getLaravelErrorMessage'
import { initializeAuthorizedSession } from '@/modules/user/services/session.service'
import { showToast } from '@/shared/toast/toastService'
import type { Department } from '@/modules/user/types/department'

interface CompleteGoogleRegistrationForm {
    department_id: number | null
    password: string
}

export const useCompleteGoogleRegistrationForm = () => {
    const router = useRouter()

    const form = reactive<CompleteGoogleRegistrationForm>({
        department_id: null,
        password: ''
    })

    const departments = ref<Department[]>([])
    const showPassword = ref(false)
    const isSubmitting = ref(false)
    const isLoadingDepartments = ref(false)

    const updateDepartmentId = (value: number | null): void => {
        form.department_id = value
    }

    const loadDepartments = async (): Promise<void> => {
        isLoadingDepartments.value = true

        try {
            const departmentsResponse = await getAllDepartments()
            departments.value = departmentsResponse.data ?? []
        } catch {
            departments.value = []
        } finally {
            isLoadingDepartments.value = false
        }
    }

    const validateForm = (): boolean => {
        if (form.department_id === null) {
            showToast('Выберите подразделение', 'error')
            return false
        }

        if (form.password.length < 8) {
            showToast('Пароль должен содержать не менее 8 символов', 'error')
            return false
        }

        return true
    }

    const handleSubmit = async (): Promise<void> => {
        if (isSubmitting.value || !validateForm() || form.department_id === null) {
            return
        }

        isSubmitting.value = true

        try {
            await completeGoogleRegistration({
                department_id: form.department_id,
                password: form.password
            })

            await initializeAuthorizedSession()
            await router.replace({ name: 'profile' })
        } catch (error: unknown) {
            const errorMessage = getLaravelErrorMessage(error)
            showToast(errorMessage ?? 'Не удалось завершить регистрацию через Google', 'error')
        } finally {
            isSubmitting.value = false
        }
    }

    onMounted(loadDepartments)

    return {
        form,
        departments,
        showPassword,
        isSubmitting,
        isLoadingDepartments,
        updateDepartmentId,
        handleSubmit
    }
}