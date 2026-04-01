import { User } from '@/user/user.ts'
import router from '@/router'
import { type Ref, ref } from 'vue'

const getUserToken = (): string | null => {
  return localStorage.getItem('token')
}

const getUserData = (): any => {
  return JSON.parse(localStorage.getItem('user_data') || '{}')
}

export const setUserToken = (token: string): void => {
  localStorage.setItem('token', token)
}

export const setUserData = (data: any): void => {
  localStorage.setItem('user_data', JSON.stringify(data))
}

export const getUser = (): User | null => {
  if (!isAuthenticated()) {
    return null
  }

  const data: any = getUserData()
  const token = getUserToken()

  return new User(
    token || '',
    data.id,
    data.email,
    data.first_name,
    data.last_name,
    data.middle_name,
    data.role_id,
    data.role_name,
    data.department_id,
    data.department_name,
    data.secondary_email
  )
}

export const isAuthenticated = (): boolean => {
  return !!getUserToken()
}

export const logout = (): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('user_data')
  setNavbarState(false)
  router.push({name: 'home'})
}

const navbar: Ref<boolean, boolean> = ref<boolean>(false)

export const setNavbarState = (value: boolean): void => {
  navbar.value = value
}

export const getNavbarState = (): boolean => {
  return navbar.value
}
