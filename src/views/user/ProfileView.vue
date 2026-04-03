<template>
    <div v-if="!user" class="page">
        Загрузка...
    </div>

    <div v-else class="page">
        <div class="page-header">
            <h1 class="page-title">Профиль</h1>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;">
            <div style="display:flex;flex-direction:column;gap:20px;">
                <div class="card">
                    <p class="card-title">Личные данные</p>
                    <div style="display:flex;flex-direction:column;gap:16px;">
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                            <div class="field">
                                <label for="last_name">Фамилия</label>
                                <input v-model="form.last_name" id="last_name" type="text"/>
                            </div>
                            <div class="field">
                                <label for="first_name">Имя</label>
                                <input v-model="form.first_name" id="first_name" type="text"/>
                            </div>
                        </div>
                        <div class="field">
                            <label for="middle_name">Отчество</label>
                            <input v-model="form.middle_name" id="middle_name" type="text"/>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <p class="card-title">Почта</p>
                    <div style="display:flex;flex-direction:column;gap:16px;">
                        <div class="field">
                            <label for="email">Основная почта</label>
                            <input v-model="form.email" id="email" type="email"/>
                        </div>
                        <div class="field">
                            <label for="secondary_email">Почта для уведомлений</label>
                            <input v-model="form.secondary_email" id="secondary_email" type="email"/>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:20px;">
                <div class="card">
                    <p class="card-title">Смена пароля</p>
                    <div class="field">
                        <label for="new_password">Новый пароль</label>
                        <input
                                :type="showPassword ? 'text' : 'password'"
                                v-model="form.new_password"
                                id="new_password"
                                placeholder="Оставьте пустым, если не меняете"
                        />
                    </div>
                    <label class="check-label" style="margin-top:8px;">
                        <input type="checkbox" v-model="showPassword"/>
                        Показать пароль
                    </label>
                </div>

                <div class="card">
                    <p class="card-title">Подразделение</p>
                    <BaseSelect
                            id="department"
                            label="Подразделение"
                            placeholder="Выберите подразделение"
                            v-model="form.department_id"
                            :items="departments"
                            label-key="name"
                            value-key="id"
                    />
                </div>

                <div class="card">
                    <p class="card-title">Действия</p>
                    <button
                            :class="['btn','btn--primary', loading ? 'btn-loading' : '']"
                            style="width:100%;margin-bottom:12px;"
                            @click="saveChanges"
                    >
                        Сохранить изменения
                    </button>
                    <div class="action-row">
                        <button class="btn btn--secondary" @click="handleLogout">Выйти</button>
                        <button class="btn btn--danger" @click="confirmDelete">Удалить аккаунт</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, reactive, ref, watch } from 'vue'
    import { useUser } from '@/composables/user/useUser'
    import { logout } from '@/user/data'
    import BaseSelect from '@/components/BaseSelect.vue'
    import { deleteCurrentUser, getAllDepartments, updateUser } from '@/api/user.api.ts'
    import { showToast } from '@/utils/toast'

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

    const { user } = useUser()

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
        const formKeys = Object.keys(form) as (keyof ProfileForm)[]

        for (const key of formKeys) {
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

    const fetchDepartments = async () => {
        try {
            const response = await getAllDepartments()
            departments.value = response.data ?? []
        } catch {
        }
    }

    onMounted(fetchDepartments)
</script>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>