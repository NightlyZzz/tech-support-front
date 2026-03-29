<template>
  <div class="page" v-if="form">
    <div class="page-header">
      <h1 class="page-title">Редактирование пользователя</h1>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;">
      <div style="display:flex;flex-direction:column;gap:20px;">
        <div class="card">
          <p class="card-title">Личные данные</p>
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
          <div class="field" style="margin-top:16px;">
            <label for="middle_name">Отчество</label>
            <input v-model="form.middle_name" id="middle_name" type="text"/>
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
          <p class="card-title">Роль</p>
          <Select
            id="role"
            label="Роль"
            placeholder="Выберите роль"
            v-model="form.role_id"
            :items="roles"
            label-key="name"
            value-key="id"
          />
        </div>

        <div class="card">
          <p class="card-title">Действия</p>
          <div class="action-row">
            <button class="btn btn--primary" @click="saveChanges">Сохранить изменения</button>
            <button class="btn btn--danger" @click="confirmDelete">Удалить пользователя</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getUser } from '@/user/data.ts'
import router from '@/router'
import Select from '@/components/Select.vue'
import {
  deleteAnotherUser, getAllDepartments, getAllRoles,
  getAnotherUser, updateAnotherUser
} from '@/utils/requests.ts'
import { showToast } from '@/utils/toast'

interface Department {
  id: number;
  name: string
}

interface Role {
  id: number;
  name: string
}

const userId: number = Number(useRoute().params.id)
const departments: any = ref<Department[]>([])
const roles: any = ref<Role[]>([])
const token: string = getUser().getToken()

const form: any = reactive({
  first_name: '', last_name: '', middle_name: '',
  email: '', secondary_email: '', new_password: '',
  department_id: null, role_id: null
})

const fetchDepartments = async (): Promise<void> => {
  try {
    const r = await getAllDepartments()
    if (r.ok) departments.value = (await r.json()).data
  } catch (e) {
    console.error(e)
  }
}

const fetchRoles = async (): Promise<void> => {
  try {
    const r = await getAllRoles()
    if (r.ok) roles.value = (await r.json()).data
  } catch (e) {
    console.error(e)
  }
}

const fetchUser = async (): Promise<void> => {
  const r = await getAnotherUser(userId, token)
  if (r.ok) Object.assign(form, (await r.json()).data)
}

const saveChanges = async (): Promise<void> => {
  const r = await updateAnotherUser(userId, form, token)
  if (r.ok) await router.push({name: 'all-users'})
  else showToast('Ошибка при сохранении', 'error')
}

const confirmDelete = async (): Promise<void> => {
  if (!confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) return

  try {
    const r = await deleteAnotherUser(userId, token)
    if (r.ok) {
      showToast('Пользователь успешно удалён', 'success')
      await router.push({name: 'all-users'})
    } else {
      const data: any = await r.json()
      showToast(data.message ?? 'Не удалось удалить пользователя', 'error')
    }
  } catch (error) {
    showToast('Произошла ошибка при удалении пользователя', 'error')
  }
}

onMounted(async () => {
  await fetchDepartments()
  await fetchRoles()
  await fetchUser()
})
</script>

<style scoped>
@import '@/assets/base.css';
@import '@/assets/list.css';
</style>
