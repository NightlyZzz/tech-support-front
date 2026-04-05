<script setup lang="ts">
    import BaseSelect from '@/components/BaseSelect.vue'
    import { useRegisterForm } from '@/modules/user/composables/useRegisterForm'

    const {
        form,
        showPassword,
        departments,
        updateDepartmentId,
        handleRegister
    } = useRegisterForm()
</script>

<template>
    <form @submit.prevent="handleRegister" class="auth-form">
        <div class="field">
            <label for="reg-email">Электронная почта</label>
            <input
                    id="reg-email"
                    v-model="form.email"
                    type="email"
                    placeholder="you@example.com"
                    required
            >
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="field">
                <label for="reg-last">Фамилия</label>
                <input
                        id="reg-last"
                        v-model="form.last_name"
                        type="text"
                        placeholder="Иванов"
                        required
                >
            </div>

            <div class="field">
                <label for="reg-first">Имя</label>
                <input
                        id="reg-first"
                        v-model="form.first_name"
                        type="text"
                        placeholder="Иван"
                        required
                >
            </div>
        </div>

        <div class="field">
            <label for="reg-middle">Отчество</label>
            <input
                    id="reg-middle"
                    v-model="form.middle_name"
                    type="text"
                    placeholder="Иванович"
                    required
            >
        </div>

        <div class="field">
            <label for="reg-password">Пароль</label>
            <div class="password-wrapper">
                <input
                        id="reg-password"
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Минимум 8 символов"
                        minlength="8"
                        required
                >
                <label class="check-label" style="margin-top:4px;">
                    <input v-model="showPassword" type="checkbox">
                    Показать пароль
                </label>
            </div>
        </div>

        <BaseSelect
                id="reg-department"
                label="Подразделение"
                placeholder="Выберите подразделение"
                :model-value="form.department_id"
                :items="departments"
                label-key="name"
                value-key="id"
                @update:model-value="updateDepartmentId"
        />

        <label class="check-label">
            <input v-model="form.remember" type="checkbox">
            Запомнить меня
        </label>

        <button type="submit" class="btn btn--primary btn--full">
            Зарегистрироваться
        </button>
    </form>
</template>