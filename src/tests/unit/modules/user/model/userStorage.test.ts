import { describe, expect, it } from 'vitest'
import {
    clearUserStorage,
    getUserData,
    hasStoredUserData,
    removeUserData,
    setUserData
} from '@/modules/user/model/userStorage'
import type { UserData } from '@/modules/user/types/user'

describe('userStorage', () => {
    it('stores and reads user data', () => {
        const userData: UserData = {
            id: 1,
            email: 'user@gmail.com',
            first_name: 'Ivan',
            last_name: 'Ivanov',
            middle_name: 'Ivanovich',
            secondary_email: null,
            role_id: 1,
            role_name: 'Пользователь',
            department_id: 2,
            department_name: 'Отдел'
        }

        expect(hasStoredUserData()).toBe(false)

        setUserData(userData)

        expect(getUserData()).toEqual(userData)
        expect(hasStoredUserData()).toBe(true)
    })

    it('returns null and clears corrupted user data', () => {
        localStorage.setItem('user_data', '{broken json')

        expect(getUserData()).toBeNull()
        expect(localStorage.getItem('user_data')).toBeNull()
        expect(hasStoredUserData()).toBe(false)
    })

    it('removes user data', () => {
        const userData: UserData = {
            id: 1,
            email: 'user@gmail.com',
            first_name: 'Ivan',
            last_name: 'Ivanov',
            middle_name: 'Ivanovich',
            secondary_email: null,
            role_id: 1,
            role_name: 'Пользователь',
            department_id: 2,
            department_name: 'Отдел'
        }

        setUserData(userData)
        removeUserData()

        expect(getUserData()).toBeNull()
        expect(hasStoredUserData()).toBe(false)
    })

    it('clears whole storage', () => {
        setUserData({
            id: 1,
            email: 'user@gmail.com',
            first_name: 'Ivan',
            last_name: 'Ivanov',
            middle_name: 'Ivanovich',
            secondary_email: null,
            role_id: 1,
            role_name: 'Пользователь',
            department_id: 2,
            department_name: 'Отдел'
        })

        clearUserStorage()

        expect(getUserData()).toBeNull()
        expect(hasStoredUserData()).toBe(false)
    })
})