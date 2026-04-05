import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    deleteAnotherUser,
    getAnotherUser,
    updateAnotherUser
} from '@/modules/user/api/user.api'
import { getAllDepartments, getAllRoles } from '@/modules/user/api/user.lookup'
import { showToast } from '@/shared/toast/toastService'
import { getEcho, createEcho } from '@/shared/realtime/echo'

interface Department {
    id: number
    name: string
}

interface Role {
    id: number
    name: string
}

interface EditableUserPayload {
    first_name?: string
    last_name?: string
    middle_name?: string
    email?: string
    secondary_email?: string | null
    department_id?: number | null
    role_id?: number | null
}

export const useEditUserPage = () => {
    const route = useRoute()
    const router = useRouter()

    const userId = Number(route.params.id)

    const departments = ref<Department[]>([])
    const roles = ref<Role[]>([])

    const form = reactive({
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        secondary_email: '',
        new_password: '',
        department_id: null as number | null,
        role_id: null as number | null
    })

    const initialSnapshot = ref('')

    const buildSnapshot = () => {
        return JSON.stringify({
            first_name: form.first_name,
            last_name: form.last_name,
            middle_name: form.middle_name,
            email: form.email,
            secondary_email: form.secondary_email,
            department_id: form.department_id,
            role_id: form.role_id
        })
    }

    const isFormDirty = () => {
        return buildSnapshot() !== initialSnapshot.value
    }

    const applyUserToForm = (userData: EditableUserPayload) => {
        form.first_name = userData.first_name ?? ''
        form.last_name = userData.last_name ?? ''
        form.middle_name = userData.middle_name ?? ''
        form.email = userData.email ?? ''
        form.secondary_email = userData.secondary_email ?? ''
        form.department_id = userData.department_id ?? null
        form.role_id = userData.role_id ?? null
        form.new_password = ''

        initialSnapshot.value = buildSnapshot()
    }

    const loadDepartments = async () => {
        const departmentsResponse = await getAllDepartments()
        departments.value = departmentsResponse.data ?? []
    }

    const loadRoles = async () => {
        const rolesResponse = await getAllRoles()
        roles.value = rolesResponse.data ?? []
    }

    const loadUser = async () => {
        const userResponse = await getAnotherUser(userId)
        applyUserToForm(userResponse.data)
    }

    const subscribeToEditedUserUpdates = () => {
        const echo = getEcho() ?? createEcho()

        if (!echo) {
            return
        }

        echo.private(`App.Models.User.${userId}`).listen('.user.updated', (updatedUser: EditableUserPayload) => {
            if (isFormDirty()) {
                showToast('Данные пользователя были изменены в другом окне', 'info')
                return
            }

            applyUserToForm(updatedUser)
            showToast('Данные пользователя обновлены', 'success')
        })
    }

    const unsubscribeFromEditedUserUpdates = () => {
        const echo = getEcho()

        if (!echo) {
            return
        }

        echo.leave(`App.Models.User.${userId}`)
    }

    const saveChanges = async () => {
        try {
            await updateAnotherUser(userId, form)
            await router.push({ name: 'all-users' })
        } catch {
            showToast('Ошибка при сохранении', 'error')
        }
    }

    const confirmDelete = async () => {
        if (!confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) {
            return
        }

        try {
            await deleteAnotherUser(userId)
            await router.push({ name: 'all-users' })
        } catch {
            showToast('Ошибка удаления', 'error')
        }
    }

    onMounted(async () => {
        await loadDepartments()
        await loadRoles()
        await loadUser()
        subscribeToEditedUserUpdates()
    })

    onUnmounted(() => {
        unsubscribeFromEditedUserUpdates()
    })

    return {
        form,
        departments,
        roles,
        saveChanges,
        confirmDelete
    }
}