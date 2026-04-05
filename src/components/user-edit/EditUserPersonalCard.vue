<script setup lang="ts">
    import type { EditUserForm } from '@/modules/user/types/edit-user'

    defineProps<{
        form: EditUserForm
    }>()
</script>

<template>
    <div class="card">
        <p class="card-title">Личные данные</p>

        <div class="profile-card-stack">
            <div class="profile-two-columns">
                <div class="field">
                    <label>Фамилия</label>
                    <input v-model="form.last_name" type="text">
                </div>

                <div class="field">
                    <label>Имя</label>
                    <input v-model="form.first_name" type="text">
                </div>
            </div>

            <div class="field">
                <label>Отчество</label>
                <input v-model="form.middle_name" type="text">
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>