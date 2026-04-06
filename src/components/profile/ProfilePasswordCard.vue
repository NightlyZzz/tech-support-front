<script setup lang="ts">
    import BaseInput from '@/components/base/BaseInput.vue'

    defineProps<{
        newPassword: string
        showPassword: boolean
    }>()

    const emit = defineEmits<{
        (event: 'update:newPassword', value: string): void
        (event: 'update:showPassword', value: boolean): void
    }>()

    const updateShowPassword = (event: Event): void => {
        const checkboxElement = event.target as HTMLInputElement
        emit('update:showPassword', checkboxElement.checked)
    }
</script>

<template>
    <div class="card">
        <p class="card-title">Смена пароля</p>

        <BaseInput
                id="profile-new-password"
                :model-value="newPassword"
                label="Новый пароль"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Оставьте пустым"
                @update:model-value="emit('update:newPassword', $event)"
        />

        <label class="check-label profile-checkbox-offset">
            <input
                    :checked="showPassword"
                    type="checkbox"
                    @change="updateShowPassword"
            >
            Показать пароль
        </label>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/profile.css';
</style>