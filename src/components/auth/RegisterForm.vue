<template>
    <form @submit.prevent="handleRegister" class="auth-form">
        <div class="field">
            <label for="reg-email">Электронная почта</label>
            <input
                    id="reg-email"
                    type="email"
                    v-model="form.email"
                    placeholder="you@example.com"
                    required
            />
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div class="field">
                <label for="reg-last">Фамилия</label>
                <input
                        id="reg-last"
                        type="text"
                        v-model="form.last_name"
                        placeholder="Иванов"
                        required
                />
            </div>

            <div class="field">
                <label for="reg-first">Имя</label>
                <input
                        id="reg-first"
                        type="text"
                        v-model="form.first_name"
                        placeholder="Иван"
                        required
                />
            </div>
        </div>

        <div class="field">
            <label for="reg-middle">Отчество</label>
            <input
                    id="reg-middle"
                    type="text"
                    v-model="form.middle_name"
                    placeholder="Иванович"
                    required
            />
        </div>

        <div class="field">
            <label for="reg-password">Пароль</label>
            <div class="password-wrapper">
                <input
                        id="reg-password"
                        :type="showPassword ? 'text' : 'password'"
                        v-model="form.password"
                        placeholder="Минимум 8 символов"
                        minlength="8"
                        required
                />
                <label class="check-label" style="margin-top:4px;">
                    <input type="checkbox" v-model="showPassword"/>
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
            <input type="checkbox" v-model="form.remember"/>
            Запомнить меня
        </label>

        <button type="submit" class="btn btn--primary btn--full">
            Зарегистрироваться
        </button>
    </form>
</template>

<script setup lang="ts">
    import { onMounted, reactive, ref } from 'vue'
    import router from '@/router'
    import BaseSelect from '@/components/BaseSelect.vue'
    import { register, login, getCurrentUser } from '@/api/auth.api'
    import { getAllDepartments } from '@/api/user.api'
    import { showToast } from '@/utils/toast'
    import { setUserToken, setUserData } from '@/user/data'

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

            const userResponse = await getCurrentUser()
            setUserData(userResponse.data)

            await router.push({ name: 'home' })
        } catch (e: any) {
            console.log('REGISTER ERROR FULL:', e)

            if (e.response) {
                const data = e.response.data as LaravelError

                if (data.errors) {
                    const firstError = Object.values(data.errors)[0][0]
                    showToast(firstError, 'error')
                    return
                }

                if (data.message) {
                    showToast(data.message, 'error')
                    return
                }
            }

            showToast('Ошибка регистрации', 'error')
        }
    }

    const fetchDepartmentTypes = async (): Promise<void> => {
        try {
            const response = await getAllDepartments()
            departmentTypes.value = response.data
        } catch (e) {
            console.log('DEPARTMENTS ERROR:', e)
        }
    }

    onMounted(fetchDepartmentTypes)
</script>