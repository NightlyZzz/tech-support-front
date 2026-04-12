import { describe, expect, it, vi } from 'vitest'

const {
    routerReplace,
    currentRoute,
    initUserMock,
    unsubscribeFromCurrentUserUpdatesMock,
    clearUserStateMock,
    clearUserStorageMock,
    disconnectEchoMock
} = vi.hoisted(() => ({
    routerReplace: vi.fn(),
    currentRoute: { value: { name: 'profile' } },
    initUserMock: vi.fn(),
    unsubscribeFromCurrentUserUpdatesMock: vi.fn(),
    clearUserStateMock: vi.fn(),
    clearUserStorageMock: vi.fn(),
    disconnectEchoMock: vi.fn()
}))

vi.mock('@/router', () => ({
    default: {
        currentRoute,
        replace: routerReplace
    }
}))

vi.mock('@/modules/user/composables/useInitUser', () => ({
    initUser: initUserMock
}))

vi.mock('@/modules/user/composables/useUserRealtime', () => ({
    unsubscribeFromCurrentUserUpdates: unsubscribeFromCurrentUserUpdatesMock
}))

vi.mock('@/modules/user/model/userState', () => ({
    clearUserState: clearUserStateMock
}))

vi.mock('@/modules/user/model/userStorage', () => ({
    clearUserStorage: clearUserStorageMock
}))

vi.mock('@/shared/realtime/echo', () => ({
    disconnectEcho: disconnectEchoMock
}))

import {
    clearClientSession,
    initializeAuthorizedSession,
    redirectToAuth
} from '@/modules/user/services/session.service'

describe('session.service', () => {
    it('initializes authorized session in correct order', async () => {
        initUserMock.mockResolvedValue(undefined)

        await initializeAuthorizedSession()

        expect(unsubscribeFromCurrentUserUpdatesMock).toHaveBeenCalledTimes(1)
        expect(disconnectEchoMock).toHaveBeenCalledTimes(1)
        expect(clearUserStorageMock).toHaveBeenCalledTimes(1)
        expect(clearUserStateMock).toHaveBeenCalledTimes(1)
        expect(initUserMock).toHaveBeenCalledWith(true)
    })

    it('clears session and throws when initUser fails', async () => {
        initUserMock.mockRejectedValue(new Error('Init failed'))

        await expect(initializeAuthorizedSession()).rejects.toThrow(
                'Failed to initialize authorized session'
        )

        expect(unsubscribeFromCurrentUserUpdatesMock).toHaveBeenCalledTimes(2)
        expect(disconnectEchoMock).toHaveBeenCalledTimes(2)
        expect(clearUserStorageMock).toHaveBeenCalledTimes(2)
        expect(clearUserStateMock).toHaveBeenCalledTimes(2)
    })

    it('clears client session', () => {
        clearClientSession()

        expect(unsubscribeFromCurrentUserUpdatesMock).toHaveBeenCalledTimes(1)
        expect(disconnectEchoMock).toHaveBeenCalledTimes(1)
        expect(clearUserStorageMock).toHaveBeenCalledTimes(1)
        expect(clearUserStateMock).toHaveBeenCalledTimes(1)
    })

    it('redirects to auth when current route is not auth', async () => {
        currentRoute.value.name = 'profile'

        await redirectToAuth()

        expect(routerReplace).toHaveBeenCalledWith({ name: 'auth' })
    })

    it('does not redirect when already on auth route', async () => {
        currentRoute.value.name = 'auth'

        await redirectToAuth()

        expect(routerReplace).not.toHaveBeenCalled()
    })
})