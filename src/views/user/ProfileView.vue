<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Профиль</h1>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="card">
          <p class="card-title">Личные данные</p>
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div class="field">
                <label for="last_name">Фамилия</label>
                <input v-model="form.last_name" id="last_name" type="text"/>
              </div>
              <div class="field">
                <label for="first_name">Имя</label>
                <input v-model="form.first_name" id="first_name" type="text"/>
              </div>
            </div>
            <div class="field">
              <label for="middle_name">Отчество</label>
              <input v-model="form.middle_name" id="middle_name" type="text"/>
            </div>
          </div>
        </div>

        <div class="card">
          <p class="card-title">Почта</p>
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div class="field">
              <label for="email">Основная почта</label>
              <input v-model="form.email" id="email" type="email"/>
            </div>
            <div class="field">
              <label for="secondary_email">Почта для уведомлений</label>
              <input v-model="form.secondary_email" id="secondary_email" type="email"/>
            </div>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="card">
          <p class="card-title">Смена пароля</p>
          <div class="field">
            <label for="new_password">Новый пароль</label>
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.new_password"
              id="new_password"
              placeholder="Оставьте пустым, если не меняете"
            />
          </div>
          <label class="check-label" style="margin-top:8px;">
            <input type="checkbox" v-model="showPassword"/>
            Показать пароль
          </label>
        </div>

        <div class="card">
          <p class="card-title">Подразделение</p>
          <Select
            id="dept"
            label="Подразделение"
            placeholder="Выберите подразделение"
            v-model="form.department_id"
            :items="departments"
            label-key="name"
            value-key="id"
          />
        </div>

        <div class="card">
          <p class="card-title">Действия</p>
          <button :class="['btn', 'btn--primary', loading ? 'btn-loading' : '']"
                  style="width:100%;margin-bottom:12px;" @click="saveChanges">
            Сохранить изменения
          </button>
          <div class="action-row">
            <button class="btn btn--secondary" @click="logout">Выйти</button>
            <button class="btn btn--danger" @click="confirmDelete">Удалить аккаунт</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getUser, logout } from '@/user/data.ts'
import { User } from '@/user/user.ts'
import Select from '@/components/Select.vue'
import { deleteCurrentUser, getAllDepartments, updateUser } from '@/utils/requests.ts'
import { showToast } from '@/utils/toast'

interface Department {
  id: number;
  name: string
}

interface ProfileForm {
  first_name: string
  last_name: string
  middle_name: string
  email: string
  secondary_email: string
  new_password: string
  department_id: number
}

const user: User = getUser()

const form: any = reactive<ProfileForm>({
  first_name: user.getFirstName(),
  last_name: user.getLastName(),
  middle_name: user.getMiddleName(),
  email: user.getEmail(),
  secondary_email: user.getSecondaryEmail() || user.getEmail(),
  new_password: '',
  department_id: user.getDepartment()
})

const original: any = ref<ProfileForm | null>(null)
original.value = {...form, new_password: ''}

const showPassword: any = ref<boolean>(false)
const departments: any = ref<Department[]>([])

const loading = ref(false)

const saveChanges = async (): Promise<void> => {
  const payload: Partial<ProfileForm> = {}
  if (!original.value) return
  for (const key in form) {
    const typedKey: keyof ProfileForm = key as keyof ProfileForm
    if (typedKey === 'new_password') {
      if (form.new_password.trim().length >= 8) payload.new_password = form.new_password.trim()
      continue
    }
    if (form[typedKey] !== original.value[typedKey]) payload[typedKey] = form[typedKey]
  }
  if (Object.keys(payload).length === 0) {
    showToast('Нет изменений для сохранения', 'info')
    return
  }
  loading.value = true
  try {
    const response: Response = await updateUser(payload, user.getToken())
    if (response.ok) {
      if (payload.new_password) form.new_password = ''
      original.value = {...form, new_password: ''}
      showToast('Данные успешно обновлены', 'success')
    } else {
      showToast('Ошибка при сохранении', 'error')
    }
  } finally {
    loading.value = false
  }
}


const confirmDelete = async (): Promise<void> => {
  if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) return
  try {
    const response: Response = await deleteCurrentUser(user.getToken())
    if (response.ok) {
      showToast('Аккаунт успешно удалён', 'success')
      setTimeout(() => logout(), 1000)
    } else {
      const data: any = await response.json()
      showToast(data.message ?? 'Не удалось удалить аккаунт', 'error')
    }
  } catch {
    showToast('Произошла ошибка при удалении аккаунта', 'error')
  }
}

const fetchDepartments = async (): Promise<void> => {
  try {
    const response: Response = await getAllDepartments()
    if (response.ok) {
      const data: any = await response.json()
      departments.value = data.data
    }
  } catch (e: any) {
    console.error('Ошибка при загрузке подразделений', e)
  }
}

onMounted(fetchDepartments)
</script>

<style scoped>
@import '@/assets/base.css';
@import '@/assets/list.css';
</style>
