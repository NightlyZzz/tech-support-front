import { describe, expect, it, vi } from 'vitest'

const {
    getCurrentUserMock,
    setUserMock,
    subscribeToCurrentUserUpdatesMock,
    unsubscribeFromCurrentUserUpdatesMock,
    clearUserStorageMock,
    setUserDataMock,
    clearUserStateMock
} = vi.hoisted(() => ({
    getCurrentUserMock: vi.fn(),
    setUserMock: vi.fn(),
    subscribeToCurrentUserUpdatesMock: vi.fn(),
    unsubscribeFromCurrentUserUpdatesMock: vi.fn(),
    clearUserStorageMock: vi.fn(),
    setUserDataMock: vi.fn(),
    clearUserStateMock: vi.fn()
}))

vi.mock('@/modules/user/api/auth.api', () => ({
    getCurrentUser: getCurrentUserMock
}))

vi.mock('@/modules/user/composables/useUser', () => ({
    useUser: () => ({
        setUser: setUserMock
    })
}))

vi.mock('@/modules/user/composables/useUserRealtime', () => ({
    subscribeToCurrentUserUpdates: subscribeToCurrentUserUpdatesMock,
    unsubscribeFromCurrentUserUpdates: unsubscribeFromCurrentUserUpdatesMock
}))

vi.mock('@/modules/user/model/userStorage', () => ({
    clearUserStorage: clearUserStorageMock,
    setUserData: setUserDataMock
}))

vi.mock('@/modules/user/model/userState', () => ({
    clearUserState: clearUserStateMock
}))

import { initUser } from '@/modules/user/composables/useInitUser'

describe('useInitUser', () => {
    it('loads current user, stores it and subscribes to realtime updates', async () => {
        getCurrentUserMock.mockResolvedValue({
            data: {
                id: 10,
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
        })

        await initUser()

        expect(getCurrentUserMock).toHaveBeenCalledTimes(1)
        expect(setUserDataMock).toHaveBeenCalledWith({
            id: 10,
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
        expect(setUserMock).toHaveBeenCalledWith({
            id: 10,
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
        expect(subscribeToCurrentUserUpdatesMock).toHaveBeenCalledTimes(1)
    })

    it('clears state and silently finishes when loading current user fails by default', async () => {
        getCurrentUserMock.mockRejectedValue(new Error('Unauthorized'))

        await expect(initUser()).resolves.toBeUndefined()

        expect(unsubscribeFromCurrentUserUpdatesMock).toHaveBeenCalledTimes(1)
        expect(clearUserStorageMock).toHaveBeenCalledTimes(1)
        expect(clearUserStateMock).toHaveBeenCalledTimes(1)
        expect(setUserDataMock).not.toHaveBeenCalled()
        expect(setUserMock).not.toHaveBeenCalled()
        expect(subscribeToCurrentUserUpdatesMock).not.toHaveBeenCalled()
    })

    it('rethrows when loading current user fails and explicit throw is requested', async () => {
        const requestError = new Error('Unauthorized')

        getCurrentUserMock.mockRejectedValue(requestError)

        await expect(initUser(true)).rejects.toThrow('Unauthorized')

        expect(unsubscribeFromCurrentUserUpdatesMock).toHaveBeenCalledTimes(1)
        expect(clearUserStorageMock).toHaveBeenCalledTimes(1)
        expect(clearUserStateMock).toHaveBeenCalledTimes(1)
    })
})