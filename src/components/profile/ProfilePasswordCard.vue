<script setup lang="ts">
    defineProps<{
        newPassword: string
        showPassword: boolean
    }>()

    const emit = defineEmits<{
        (event: 'update:newPassword', value: string): void
        (event: 'update:showPassword', value: boolean): void
    }>()

    const updateShowPassword = (event: Event) => {
        const checkboxElement = event.target as HTMLInputElement
        emit('update:showPassword', checkboxElement.checked)
    }
</script>

<template>
    <div class="card">
        <p class="card-title">Смена пароля</p>

        <div class="field">
            <label>Новый пароль</label>
            <input
                    :value="newPassword"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Оставьте пустым"
                    @input="emit('update:newPassword', ($event.target as HTMLInputElement).value)"
            >
        </div>

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
    @import '@/assets/list.css';
</style>