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
        showPassword: boolean
    }>()

    const emit = defineEmits<{
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
                    v-model="form.new_password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Оставьте пустым"
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