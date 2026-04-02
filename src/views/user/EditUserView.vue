<template>
    <div class="page" v-if="form">
        <div class="page-header">
            <h1 class="page-title">Редактирование пользователя</h1>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;">
            <div style="display:flex;flex-direction:column;gap:20px;">
                <div class="card">
                    <p class="card-title">Личные данные</p>
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
                    <div class="field" style="margin-top:16px;">
                        <label for="middle_name">Отчество</label>
                        <input v-model="form.middle_name" id="middle_name" type="text"/>
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
                    <p class="card-title">Роль</p>
                    <BaseSelect
                            id="role"
                            label="Роль"
                            placeholder="Выберите роль"
                            v-model="form.role_id"
                            :items="roles"
                            label-key="name"
                            value-key="id"
                    />
                </div>

                <div class="card">
                    <p class="card-title">Действия</p>
                    <div class="action-row">
                        <button class="btn btn--primary" @click="saveChanges">Сохранить изменения</button>
                        <button class="btn btn--danger" @click="confirmDelete">Удалить пользователя</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, reactive, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import router from '@/router'
    import BaseSelect from '@/components/BaseSelect.vue'
    import {
        deleteAnotherUser,
        getAllDepartments,
        getAllRoles,
        getAnotherUser,
        updateAnotherUser
    } from '@/utils/requests'
    import { showToast } from '@/utils/toast'

    interface Department {
        id: number
        name: string
    }

    interface Role {
        id: number
        name: string
    }

    const route = useRoute()
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

    const fetchDepartments = async () => {
        const response = await getAllDepartments()
        departments.value = response.data
    }

    const fetchRoles = async () => {
        const response = await getAllRoles()
        roles.value = response.data
    }

    const fetchUser = async () => {
        const response = await getAnotherUser(userId)
        Object.assign(form, response.data)
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
        await fetchDepartments()
        await fetchRoles()
        await fetchUser()
    })
</script>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>
