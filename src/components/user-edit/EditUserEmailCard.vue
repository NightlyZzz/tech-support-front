<script setup lang="ts">
    import type { EditUserForm } from '@/modules/user/types/edit-user'

    defineProps<{
        form: EditUserForm
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