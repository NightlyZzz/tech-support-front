<script setup lang="ts">
    defineProps<{
        email: string
        secondaryEmail: string
    }>()

    const emit = defineEmits<{
        (event: 'update:email', value: string): void
        (event: 'update:secondaryEmail', value: string): void
    }>()
</script>

<template>
    <div class="card">
        <p class="card-title">Почта</p>

        <div class="profile-card-stack">
            <div class="field">
                <label>Основная почта</label>
                <input
                        :value="email"
                        type="email"
                        @input="emit('update:email', ($event.target as HTMLInputElement).value)"
                >
            </div>

            <div class="field">
                <label>Почта для уведомлений</label>
                <input
                        :value="secondaryEmail"
                        type="email"
                        @input="emit('update:secondaryEmail', ($event.target as HTMLInputElement).value)"
                >
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>