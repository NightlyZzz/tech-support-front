import { onMounted, reactive, ref, watch } from 'vue'
import { useUser } from '@/modules/user/composables/useUser'
import { logout } from '@/modules/user/services/auth.service'
import { deleteCurrentUser, updateUser } from '@/modules/user/api/user.api'
import { getAllDepartments } from '@/modules/user/api/user.lookup'
import { setUserData } from '@/modules/user/model/userStorage'
import { showToast } from '@/shared/toast/toastService'
import { buildUpdatedUserData, buildUserUpdatePayload } from '@/modules/user/helpers/userUpdatePayload'
import type { Department } from '@/modules/user/types/department'
import type { ProfileForm } from '@/modules/user/types/profile'

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

    const syncFormFromUser = (): void => {
        if (!user.value) {
            return
        }

        form.first_name = user.value.getFirstName()
        form.last_name = user.value.getLastName()
        form.middle_name = user.value.getMiddleName()
        form.email = user.value.getEmail()
        form.secondary_email = user.value.getSecondaryEmail() ?? user.value.getEmail()
        form.department_id = user.value.getDepartment()
        form.new_password = ''

        originalForm.value = { ...form }
    }

    const openLogoutModal = (): void => {
        logoutModalOpen.value = true
    }

    const closeLogoutModal = (): void => {
        if (logoutLoading.value) {
            return
        }

        logoutModalOpen.value = false
    }

    const handleLogout = async (allDevices: boolean): Promise<void> => {
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

    const saveChanges = async (): Promise<void> => {
        const updatePayload = buildUserUpdatePayload(form, originalForm.value, {
            compareWithOriginal: true
        })

        if (!Object.keys(updatePayload).length) {
            return
        }

        loading.value = true

        try {
            await updateUser(updatePayload)

            if (user.value) {
                const updatedCurrentUser = buildUpdatedUserData(
                        user.value.toStorage(),
                        form,
                        departments.value
                )

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

    const confirmDelete = async (): Promise<void> => {
        if (!confirm('Удалить аккаунт?')) {
            return
        }

        await deleteCurrentUser()
        await logout()
    }

    const loadDepartments = async (): Promise<void> => {
        try {
            const departmentsResponse = await getAllDepartments()
            departments.value = departmentsResponse.data ?? []
        } catch {
            departments.value = []
        }
    }

    watch(
            user,
            () => {
                syncFormFromUser()
            },
            { immediate: true }
    )

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