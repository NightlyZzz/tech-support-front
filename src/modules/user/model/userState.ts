import { shallowRef } from 'vue'
import type { User } from '@/modules/user/model/user'

const currentUser = shallowRef<User | null>(null)

export const getUser = () => currentUser

export const setUserState = (value: User | null): void => {
    currentUser.value = value
}

export const clearUserState = (): void => {
    currentUser.value = null
}

export const isAuthenticated = (): boolean => {
    return currentUser.value !== null
}