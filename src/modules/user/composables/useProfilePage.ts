import { reactive, ref, watch, onMounted } from 'vue'
import { useUser } from '@/modules/user/composables/useUser'
import { logout } from '@/modules/user/services/auth.service'
import { deleteCurrentUser, updateUser } from '@/modules/user/api/user.api'
import { getAllDepartments } from '@/modules/user/api/user.lookup'
import { showToast } from '@/shared/toast/toastService'

interface Department {
    id: number
    name: string
}

interface ProfileForm {
    first_name: string
    last_name: string
    middle_name: string
    email: string
    secondary_email: string
    new_password: string
    department_id: number
}

export const useProfilePage = () => {
    const { user, setUser } = useUser()

    const form = reactive<ProfileForm>({
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        secondary_email: '',
        new_password: '',
        department_id: 0
    })

    const originalForm = ref<ProfileForm>({ ...form })

    watch(user, (u) => {
        if (!u) {
            return
        }

        form.first_name = u.getFirstName()
        form.last_name = u.getLastName()
        form.middle_name = u.getMiddleName()
        form.email = u.getEmail()
        form.secondary_email = u.getSecondaryEmail() || u.getEmail()
        form.department_id = u.getDepartment()

        originalForm.value = { ...form }
    }, { immediate: true })

    const departments = ref<Department[]>([])
    const showPassword = ref(false)
    const loading = ref(false)

    const handleLogout = async () => {
        await logout()
    }

    const saveChanges = async () => {
        const payload: Partial<ProfileForm> = {}
        const keys = Object.keys(form) as (keyof ProfileForm)[]

        for (const key of keys) {
            if (key === 'new_password') {
                if (form.new_password.trim().length >= 8) {
                    payload.new_password = form.new_password.trim()
                }
                continue
            }

            if (form[key] !== originalForm.value[key]) {
                payload[key] = form[key] as any
            }
        }

        if (!Object.keys(payload).length) {
            return
        }

        loading.value = true

        try {
            await updateUser(payload)

            const updatedUser = {
                ...user.value,
                first_name: form.first_name,
                last_name: form.last_name,
                middle_name: form.middle_name,
                email: form.email,
                secondary_email: form.secondary_email,
                department_id: form.department_id
            }

            setUser(updatedUser)

            originalForm.value = { ...form }
            form.new_password = ''

            showToast('Сохранено', 'success')
        } catch {
            showToast('Ошибка', 'error')
        } finally {
            loading.value = false
        }
    }

    const confirmDelete = async () => {
        if (!confirm('Удалить аккаунт?')) {
            return
        }

        await deleteCurrentUser()
        await logout()
    }

    const loadDepartments = async () => {
        try {
            const response = await getAllDepartments()
            departments.value = response.data ?? []
        } catch {
        }
    }

    onMounted(loadDepartments)

    return {
        user,
        form,
        departments,
        showPassword,
        loading,
        handleLogout,
        saveChanges,
        confirmDelete
    }
}