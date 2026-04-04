import { ref } from 'vue'
import type { User } from '@/modules/user/model/user'

const user = ref<User | null>(null)

export const getUser = () => user

export const setUserState = (value: User | null): void => {
    user.value = value
}

export const clearUserState = (): void => {
    user.value = null
}

export const isAuthenticated = (): boolean => {
    return user.value !== null
}