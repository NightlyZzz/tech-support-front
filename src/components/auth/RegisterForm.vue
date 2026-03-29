<template>
  <form @submit.prevent="handleRegister" class="auth-form">
    <div class="field">
      <label for="reg-email">Электронная почта</label>
      <input id="reg-email" type="email" v-model="form.email" placeholder="you@example.com" required/>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="field">
        <label for="reg-last">Фамилия</label>
        <input id="reg-last" type="text" v-model="form.last_name" placeholder="Иванов" required/>
      </div>
      <div class="field">
        <label for="reg-first">Имя</label>
        <input id="reg-first" type="text" v-model="form.first_name" placeholder="Иван" required/>
      </div>
    </div>

    <div class="field">
      <label for="reg-middle">Отчество</label>
      <input id="reg-middle" type="text" v-model="form.middle_name" placeholder="Иванович" required/>
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

    <Select
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

    <button type="submit" class="btn btn--primary btn--full">Зарегистрироваться</button>
  </form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import router from '@/router'
import { refreshAuthData } from '@/utils/utils'
import Select from '@/components/Select.vue'
import { register, getAllDepartments } from '@/utils/requests'
import { showToast } from '@/utils/toast'

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
  department_id: number
  remember: boolean
}

const form: any = reactive<RegisterForm>({
  first_name: '',
  last_name: '',
  middle_name: '',
  email: '',
  password: '',
  department_id: 0,
  remember: false
})

const showPassword = ref<boolean>(false)
const departmentTypes = ref<DepartmentType[]>([])

const handleRegister = async (): Promise<void> => {
  if (form.password.length < 8) {
    showToast('Пароль должен содержать не менее 8 символов', 'error')
    return
  }

  try {
    const response: Response = await register(form)

    if (!response.ok) {
      throw new Error('Response is not OK')
    }

    const {token} = await response.json()
    await refreshAuthData(token)
    await router.push({name: 'home'})
  } catch (error) {
    console.log(error)
    showToast('Ошибка регистрации', 'error')
  }
}

const fetchDepartmentTypes = async (): Promise<void> => {
  try {
    const response: Response = await getAllDepartments()

    if (response.ok) {
      const data = await response.json()
      departmentTypes.value = data.data
    } else {
      console.error('Не удалось загрузить подразделения')
    }
  } catch (e) {
    console.error('Ошибка при загрузке подразделений', e)
  }
}

onMounted(fetchDepartmentTypes)
</script>
