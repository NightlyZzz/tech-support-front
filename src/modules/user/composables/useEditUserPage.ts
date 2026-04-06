import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    deleteAnotherUser,
    getAnotherUser,
    updateAnotherUser
} from '@/modules/user/api/user.api'
import { getAllDepartments, getAllRoles } from '@/modules/user/api/user.lookup'
import { showToast } from '@/shared/toast/toastService'
import { createEcho, getEcho } from '@/shared/realtime/echo'
import {
    buildEditUserSnapshot,
    mapEditableUserPayloadToForm
} from '@/modules/user/helpers/editUserSnapshot'
import { buildUserUpdatePayload } from '@/modules/user/helpers/userUpdatePayload'
import type {
    EditableUserPayload,
    EditUserDepartment,
    EditUserForm,
    EditUserRole,
    EditableUserResponse
} from '@/modules/user/types/edit-user'

export const useEditUserPage = () => {
    const route = useRoute()
    const router = useRouter()

    const userId = Number(route.params.id)

    const departments = ref<EditUserDepartment[]>([])
    const roles = ref<EditUserRole[]>([])

    const form = reactive<EditUserForm>({
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        secondary_email: '',
        new_password: '',
        department_id: null,
        role_id: null
    })

    const initialSnapshot = ref('')

    const syncSnapshot = (): void => {
        initialSnapshot.value = buildEditUserSnapshot(form)
    }

    const isFormDirty = (): boolean => {
        return buildEditUserSnapshot(form) !== initialSnapshot.value
    }

    const applyUserToForm = (userData: EditableUserPayload): void => {
        const nextForm = mapEditableUserPayloadToForm(userData)

        form.first_name = nextForm.first_name
        form.last_name = nextForm.last_name
        form.middle_name = nextForm.middle_name
        form.email = nextForm.email
        form.secondary_email = nextForm.secondary_email
        form.new_password = nextForm.new_password
        form.department_id = nextForm.department_id
        form.role_id = nextForm.role_id

        syncSnapshot()
    }

    const buildUpdatePayload = () => {
        return buildUserUpdatePayload(form, undefined, {
            includeRoleId: form.role_id
        })
    }

    const loadDepartments = async (): Promise<void> => {
        const departmentsResponse = await getAllDepartments()
        departments.value = departmentsResponse.data ?? []
    }

    const loadRoles = async (): Promise<void> => {
        const rolesResponse = await getAllRoles()
        roles.value = rolesResponse.data ?? []
    }

    const loadUser = async (): Promise<void> => {
        const userResponse = await getAnotherUser(userId) as EditableUserResponse
        applyUserToForm(userResponse.data)
    }

    const subscribeToEditedUserUpdates = (): void => {
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

    const unsubscribeFromEditedUserUpdates = (): void => {
        const echo = getEcho()

        if (!echo) {
            return
        }

        echo.leave(`App.Models.User.${userId}`)
    }

    const saveChanges = async (): Promise<void> => {
        try {
            await updateAnotherUser(userId, buildUpdatePayload())
            await router.push({ name: 'all-users' })
        } catch {
            showToast('Ошибка при сохранении', 'error')
        }
    }

    const confirmDelete = async (): Promise<void> => {
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