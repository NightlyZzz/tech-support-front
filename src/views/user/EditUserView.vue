<script setup lang="ts">
    import BaseSelect from '@/components/BaseSelect.vue'
    import { useEditUserPage } from '@/modules/user/composables/useEditUserPage'

    const {
        form,
        departments,
        roles,
        saveChanges,
        confirmDelete
    } = useEditUserPage()
</script>

<template>
    <div class="page">
        <div class="page-header">
            <h1 class="page-title">Редактирование пользователя</h1>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
            <div style="display:flex;flex-direction:column;gap:20px;">
                <div class="card">
                    <p class="card-title">Личные данные</p>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                        <div class="field">
                            <label>Фамилия</label>
                            <input v-model="form.last_name" type="text"/>
                        </div>

                        <div class="field">
                            <label>Имя</label>
                            <input v-model="form.first_name" type="text"/>
                        </div>
                    </div>

                    <div class="field" style="margin-top:16px;">
                        <label>Отчество</label>
                        <input v-model="form.middle_name" type="text"/>
                    </div>
                </div>

                <div class="card">
                    <p class="card-title">Почта</p>

                    <div style="display:flex;flex-direction:column;gap:16px;">
                        <div class="field">
                            <label>Основная почта</label>
                            <input v-model="form.email" type="email"/>
                        </div>

                        <div class="field">
                            <label>Почта для уведомлений</label>
                            <input v-model="form.secondary_email" type="email"/>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:20px;">
                <div class="card">
                    <p class="card-title">Подразделение</p>

                    <BaseSelect
                            v-model="form.department_id"
                            :items="departments"
                            label-key="name"
                            value-key="id"
                    />
                </div>

                <div class="card">
                    <p class="card-title">Роль</p>

                    <BaseSelect
                            v-model="form.role_id"
                            :items="roles"
                            label-key="name"
                            value-key="id"
                    />
                </div>

                <div class="card">
                    <p class="card-title">Действия</p>

                    <div class="action-row">
                        <button class="btn btn--primary" @click="saveChanges">
                            Сохранить изменения
                        </button>

                        <button class="btn btn--danger" @click="confirmDelete">
                            Удалить пользователя
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>