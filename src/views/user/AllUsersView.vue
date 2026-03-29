<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Пользователи</h1>
      <span style="font-size:.875rem;color:var(--c-text-3);">{{ filteredUsers.length }} чел.</span>
    </div>

    <div class="search-field">
      <span class="search-field-icon">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"
             stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/>
        </svg>
      </span>
      <input v-model="search" type="text" placeholder="Поиск по ФИО…"/>
    </div>

    <div v-if="filteredUsers.length === 0" class="empty-state">
      Пользователи не найдены
    </div>

    <div v-else style="display:flex;flex-direction:column;gap:10px;">
      <div
        v-for="(u, index) in filteredUsers"
        :key="u.getId()"
        :class="['user-card', 'animate-in', isCurrentUser(u.getId()) ? 'self' : u.getRole() === 2 ? 'employee' : u.getRole() === 3 ? 'admin' : '']"
        :style="{ animationDelay: index * 0.05 + 's' }"
        @click="openUser(u.getId())">
        <div class="user-avatar">
          {{ initials(u) }}
        </div>
        <div class="user-card-body">
          <div class="user-card-name">{{ u.getLastName() }} {{ u.getFirstName() }}
            {{ u.getMiddleName() }}
          </div>
          <div class="user-card-meta">{{ u.getRoleName() }} · {{ u.getDepartmentName() }}</div>
        </div>
        <span v-if="isCurrentUser(u.getId())" class="user-self-badge">Вы</span>
        <svg v-else width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"
             stroke-width="2" style="color:var(--c-text-3);flex-shrink:0;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUser } from '@/user/data.ts'
import { User } from '@/user/user.ts'
import { getAllUsers } from '@/utils/requests.ts'

const router = useRouter()
const users = ref<User[]>([])
const search = ref('')
const currentUser: User = getUser()

const initials = (u: User) =>
  (u.getLastName()[0] || '') + (u.getFirstName()[0] || '')

onMounted(async (): Promise<void> => {
  const response: Response = await getAllUsers(currentUser.getToken())

  if (response.ok) {
    const data: any = await response.json()
    users.value = data.data.map((d: any) => new User(
      '', d.id, d.email, d.first_name, d.last_name, d.middle_name,
      d.role_id, d.role_name, d.department_id, d.department_name, d.secondary_email
    ))
  }
})

const isCurrentUser = (id: number) => id === currentUser.getId()

const openUser = (id: number) => {
  if (!isCurrentUser(id)) {
    router.push({name: 'edit-user', params: {id}})
  }
}

const filteredUsers = computed(() => {
  const q = search.value.toLowerCase()
  return users.value.filter((u: User) =>
    `${u.getLastName()} ${u.getFirstName()} ${u.getMiddleName()}`.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
@import '@/assets/base.css';
@import '@/assets/list.css';
</style>
