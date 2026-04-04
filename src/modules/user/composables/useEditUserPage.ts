import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
    deleteAnotherUser,
    getAnotherUser,
    updateAnotherUser
} from '@/modules/user/api/user.api'
import { getAllDepartments, getAllRoles } from '@/modules/user/api/user.lookup'
import { showToast } from '@/shared/toast/toastService'

interface Department {
    id: number
    name: string
}

interface Role {
    id: number
    name: string
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

    const loadDepartments = async () => {
        const res = await getAllDepartments()
        departments.value = res.data ?? []
    }

    const loadRoles = async () => {
        const res = await getAllRoles()
        roles.value = res.data ?? []
    }

    const loadUser = async () => {
        const res = await getAnotherUser(userId)
        Object.assign(form, res.data)
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
    })

    return {
        form,
        departments,
        roles,
        saveChanges,
        confirmDelete
    }
}