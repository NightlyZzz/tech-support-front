import { reactive, ref, watch, onMounted } from 'vue'
import { useUser } from '@/modules/user/composables/useUser'
import { logout } from '@/modules/user/services/auth.service'
import { deleteCurrentUser, updateUser } from '@/modules/user/api/user.api'
import { getAllDepartments } from '@/modules/user/api/user.lookup'
import { setUserData } from '@/modules/user/model/userStorage'
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
    const departments = ref<Department[]>([])
    const showPassword = ref(false)
    const loading = ref(false)
    const logoutModalOpen = ref(false)
    const logoutLoading = ref(false)

    const syncFormFromUser = () => {
        if (!user.value) {
            return
        }

        form.first_name = user.value.getFirstName()
        form.last_name = user.value.getLastName()
        form.middle_name = user.value.getMiddleName()
        form.email = user.value.getEmail()
        form.secondary_email = user.value.getSecondaryEmail() || user.value.getEmail()
        form.department_id = user.value.getDepartment()
        form.new_password = ''

        originalForm.value = { ...form }
    }

    watch(user, () => {
        syncFormFromUser()
    }, { immediate: true })

    const openLogoutModal = () => {
        logoutModalOpen.value = true
    }

    const closeLogoutModal = () => {
        if (logoutLoading.value) {
            return
        }

        logoutModalOpen.value = false
    }

    const handleLogout = async (allDevices: boolean) => {
        if (logoutLoading.value) {
            return
        }

        logoutLoading.value = true

        try {
            await logout(allDevices)
        } finally {
            logoutLoading.value = false
            logoutModalOpen.value = false
        }
    }

    const saveChanges = async () => {
        const changedFields: Partial<ProfileForm> = {}
        const formKeys = Object.keys(form) as (keyof ProfileForm)[]

        for (const fieldName of formKeys) {
            if (fieldName === 'new_password') {
                const trimmedPassword = form.new_password.trim()

                if (trimmedPassword.length >= 8) {
                    changedFields.new_password = trimmedPassword
                }

                continue
            }

            if (form[fieldName] !== originalForm.value[fieldName]) {
                changedFields[fieldName] = form[fieldName] as never
            }
        }

        if (!Object.keys(changedFields).length) {
            return
        }

        loading.value = true

        try {
            await updateUser(changedFields)

            if (user.value) {
                const selectedDepartmentName =
                        departments.value.find(departmentItem => departmentItem.id === form.department_id)?.name ??
                        user.value.getDepartmentName()

                const updatedCurrentUser = {
                    token: user.value.getToken(),
                    id: user.value.getId(),
                    email: form.email,
                    first_name: form.first_name,
                    last_name: form.last_name,
                    middle_name: form.middle_name,
                    role_id: user.value.getRole(),
                    role_name: user.value.getRoleName(),
                    department_id: form.department_id,
                    department_name: selectedDepartmentName,
                    secondary_email: form.secondary_email
                }

                setUserData(updatedCurrentUser)
                setUser(updatedCurrentUser)
            }

            syncFormFromUser()
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
            const departmentsResponse = await getAllDepartments()
            departments.value = departmentsResponse.data ?? []
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
        logoutModalOpen,
        logoutLoading,
        openLogoutModal,
        closeLogoutModal,
        handleLogout,
        saveChanges,
        confirmDelete
    }
}