<script setup lang="ts">
    import BaseButton from '@/components/base/BaseButton.vue'
    import BaseInput from '@/components/base/BaseInput.vue'
    import BaseSelect from '@/components/base/BaseSelect.vue'
    import { useRegisterForm } from '@/modules/user/composables/useRegisterForm'

    const {
        form,
        showPassword,
        departments,
        isSubmitting,
        updateDepartmentId,
        handleRegister
    } = useRegisterForm()
</script>

<template>
    <form @submit.prevent="handleRegister" class="auth-form">
        <BaseInput
                id="reg-email"
                v-model="form.email"
                label="Электронная почта"
                type="email"
                placeholder="you@example.com"
                :required="true"
                :disabled="isSubmitting"
        />

        <div class="auth-two-columns">
            <BaseInput
                    id="reg-last"
                    v-model="form.last_name"
                    label="Фамилия"
                    type="text"
                    placeholder="Иванов"
                    :required="true"
                    :disabled="isSubmitting"
            />

            <BaseInput
                    id="reg-first"
                    v-model="form.first_name"
                    label="Имя"
                    type="text"
                    placeholder="Иван"
                    :required="true"
                    :disabled="isSubmitting"
            />
        </div>

        <BaseInput
                id="reg-middle"
                v-model="form.middle_name"
                label="Отчество"
                type="text"
                placeholder="Иванович"
                :required="true"
                :disabled="isSubmitting"
        />

        <div class="field">
            <label for="reg-password">Пароль</label>

            <div class="password-wrapper">
                <BaseInput
                        id="reg-password"
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Минимум 8 символов"
                        :required="true"
                        :minlength="8"
                        :disabled="isSubmitting"
                />

                <label class="check-label auth-checkbox-inline">
                    <input v-model="showPassword" type="checkbox" :disabled="isSubmitting">
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
            <input v-model="form.remember" type="checkbox" :disabled="isSubmitting">
            Запомнить меня
        </label>

        <BaseButton
                type="submit"
                variant="primary"
                :full-width="true"
                :loading="isSubmitting"
        >
            Зарегистрироваться
        </BaseButton>
    </form>
</template>