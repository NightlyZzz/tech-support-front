<script setup lang="ts">
    import BaseInput from '@/components/base/BaseInput.vue'

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
            <BaseInput
                    id="edit-user-email"
                    :model-value="email"
                    label="Основная почта"
                    type="email"
                    @update:model-value="emit('update:email', $event)"
            />

            <BaseInput
                    id="edit-user-secondary-email"
                    :model-value="secondaryEmail"
                    label="Почта для уведомлений"
                    type="email"
                    @update:model-value="emit('update:secondaryEmail', $event)"
            />
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/profile.css';
</style>