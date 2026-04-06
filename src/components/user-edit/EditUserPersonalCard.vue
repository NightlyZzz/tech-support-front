<script setup lang="ts">
    import BaseInput from '@/components/base/BaseInput.vue'

    defineProps<{
        lastName: string
        firstName: string
        middleName: string
    }>()

    const emit = defineEmits<{
        (event: 'update:lastName', value: string): void
        (event: 'update:firstName', value: string): void
        (event: 'update:middleName', value: string): void
    }>()
</script>

<template>
    <div class="card">
        <p class="card-title">Личные данные</p>

        <div class="profile-card-stack">
            <div class="profile-two-columns">
                <BaseInput
                        id="edit-user-last-name"
                        :model-value="lastName"
                        label="Фамилия"
                        type="text"
                        @update:model-value="emit('update:lastName', $event)"
                />

                <BaseInput
                        id="edit-user-first-name"
                        :model-value="firstName"
                        label="Имя"
                        type="text"
                        @update:model-value="emit('update:firstName', $event)"
                />
            </div>

            <BaseInput
                    id="edit-user-middle-name"
                    :model-value="middleName"
                    label="Отчество"
                    type="text"
                    @update:model-value="emit('update:middleName', $event)"
            />
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/profile.css';
</style>