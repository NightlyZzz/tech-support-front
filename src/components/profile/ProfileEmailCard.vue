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
        <p class="card-title">Почта</p>

        <div class="profile-card-stack">
            <div class="field">
                <label>Основная почта</label>
                <input v-model="form.email" type="email">
            </div>

            <div class="field">
                <label>Почта для уведомлений</label>
                <input v-model="form.secondary_email" type="email">
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>