import { beforeEach, describe, expect, it } from 'vitest'
import {
    clearUserStorage,
    getUserData,
    hasStoredUserData,
    removeUserData,
    setUserData
} from '@/modules/user/model/userStorage'
import type { UserData } from '@/modules/user/types/user'

describe('userStorage', () => {
    beforeEach(() => {
        sessionStorage.clear()
        localStorage.clear()
    })

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
            department_name: 'Отдел',
            requires_google_registration_completion: false
        }

        expect(hasStoredUserData()).toBe(false)

        setUserData(userData)

        expect(getUserData()).toEqual(userData)
        expect(hasStoredUserData()).toBe(true)
    })

    it('returns null and clears corrupted user data', () => {
        sessionStorage.setItem('user_data', '{broken json')

        expect(getUserData()).toBeNull()
        expect(sessionStorage.getItem('user_data')).toBeNull()
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
            department_name: 'Отдел',
            requires_google_registration_completion: false
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
            department_name: 'Отдел',
            requires_google_registration_completion: false
        })

        clearUserStorage()

        expect(getUserData()).toBeNull()
        expect(hasStoredUserData()).toBe(false)
    })
})