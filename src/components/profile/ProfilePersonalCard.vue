<script setup lang="ts">
    type ProfileForm = {
        first_name: string
        last_name: string
        middle_name: string
        email: string
        secondary_email: string
        new_password: string
        department_id: number
    }

    defineProps<{
        form: ProfileForm
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