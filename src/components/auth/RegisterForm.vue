<script setup lang="ts">
    import { onMounted, reactive, ref } from 'vue'
    import router from '@/router'
    import BaseSelect from '@/components/BaseSelect.vue'
    import { register, login } from '@/modules/user/api/auth.api'
    import { showToast } from '@/shared/toast/toastService'
    import { setUserToken } from '@/modules/user/model/userStorage'
    import { getAllDepartments } from '@/modules/user/api/user.lookup'
    import { initUser } from '@/modules/user/composables/useInitUser'
    import { createEcho, disconnectEcho } from '@/shared/realtime/echo'

    interface DepartmentType {
        id: number
        name: string
    }

    interface RegisterForm {
        first_name: string
        last_name: string
        middle_name: string
        email: string
        password: string
        department_id: number | null
        remember: boolean
    }

    interface LaravelError {
        message: string
        errors?: Record<string, string[]>
    }

    const form = reactive<RegisterForm>({
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        password: '',
        department_id: null,
        remember: false
    })

    const showPassword = ref(false)
    const departmentTypes = ref<DepartmentType[]>([])

    const handleRegister = async (): Promise<void> => {
        if (form.password.length < 8) {
            showToast('Пароль должен содержать не менее 8 символов', 'error')
            return
        }

        if (!form.department_id) {
            showToast('Выберите подразделение', 'error')
            return
        }

        try {
            await register({
                first_name: form.first_name,
                last_name: form.last_name,
                middle_name: form.middle_name,
                email: form.email,
                password: form.password,
                department_id: Number(form.department_id),
                remember: form.remember
            })

            const loginResponse = await login({
                email: form.email,
                password: form.password
            })

            setUserToken(loginResponse.token)

            disconnectEcho()
            createEcho()

            await initUser()

            await router.push({ name: 'home' })
        } catch (error: any) {
            if (error.response) {
                const laravelError = error.response.data as LaravelError

                if (laravelError.errors) {
                    const firstErrorMessage = Object.values(laravelError.errors)[0][0]
                    showToast(firstErrorMessage, 'error')
                    return
                }

                if (laravelError.message) {
                    showToast(laravelError.message, 'error')
                    return
                }
            }

            showToast('Ошибка регистрации', 'error')
        }
    }

    const loadDepartmentTypes = async (): Promise<void> => {
        try {
            const departmentsResponse = await getAllDepartments()
            departmentTypes.value = departmentsResponse.data
        } catch {
        }
    }

    onMounted(loadDepartmentTypes)
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
            />
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
                />
            </div>

            <div class="field">
                <label for="reg-first">Имя</label>
                <input
                        id="reg-first"
                        v-model="form.first_name"
                        type="text"
                        placeholder="Иван"
                        required
                />
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
            />
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
                />
                <label class="check-label" style="margin-top:4px;">
                    <input v-model="showPassword" type="checkbox"/>
                    Показать пароль
                </label>
            </div>
        </div>

        <BaseSelect
                id="reg-department"
                label="Подразделение"
                placeholder="Выберите подразделение"
                v-model="form.department_id"
                :items="departmentTypes"
                label-key="name"
                value-key="id"
        />

        <label class="check-label">
            <input v-model="form.remember" type="checkbox"/>
            Запомнить меня
        </label>

        <button type="submit" class="btn btn--primary btn--full">
            Зарегистрироваться
        </button>
    </form>
</template>