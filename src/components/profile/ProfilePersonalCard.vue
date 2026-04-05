<script setup lang="ts">
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
                <div class="field">
                    <label>Фамилия</label>
                    <input
                            :value="lastName"
                            type="text"
                            @input="emit('update:lastName', ($event.target as HTMLInputElement).value)"
                    >
                </div>

                <div class="field">
                    <label>Имя</label>
                    <input
                            :value="firstName"
                            type="text"
                            @input="emit('update:firstName', ($event.target as HTMLInputElement).value)"
                    >
                </div>
            </div>

            <div class="field">
                <label>Отчество</label>
                <input
                        :value="middleName"
                        type="text"
                        @input="emit('update:middleName', ($event.target as HTMLInputElement).value)"
                >
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>