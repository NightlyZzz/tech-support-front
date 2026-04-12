import { AxiosHeaders } from 'axios'
import { describe, expect, it, vi } from 'vitest'

const {
    routerReplace,
    currentRoute,
    hasStoredUserDataMock,
    getEchoMock,
    clearClientSessionMock
} = vi.hoisted(() => ({
    routerReplace: vi.fn(),
    currentRoute: { value: { name: 'profile' } },
    hasStoredUserDataMock: vi.fn(),
    getEchoMock: vi.fn(),
    clearClientSessionMock: vi.fn()
}))

vi.mock('@/router', () => ({
    default: {
        currentRoute,
        replace: routerReplace
    }
}))

vi.mock('@/modules/user/model/userStorage', () => ({
    hasStoredUserData: hasStoredUserDataMock
}))

vi.mock('@/shared/realtime/echo', () => ({
    getEcho: getEchoMock
}))

vi.mock('@/modules/user/services/session.service', () => ({
    clearClientSession: clearClientSessionMock
}))

import { enrichApiRequestConfig, handleApiClientError } from '@/shared/api/client'

describe('shared/api/client', () => {
    it('adds socket id header when echo instance exists', () => {
        getEchoMock.mockReturnValue({
            socketId: () => 'socket-123'
        })

        const config = enrichApiRequestConfig({
            headers: new AxiosHeaders()
        } as never)

        expect(config.headers.get('X-Socket-Id')).toBe('socket-123')
    })

    it('does not add socket id header when echo instance is absent', () => {
        getEchoMock.mockReturnValue(null)

        const config = enrichApiRequestConfig({
            headers: new AxiosHeaders()
        } as never)

        expect(config.headers.get('X-Socket-Id')).toBeUndefined()
    })

    it('clears session and redirects to auth on non-auth 401', async () => {
        hasStoredUserDataMock.mockReturnValue(true)
        currentRoute.value.name = 'profile'

        const error = {
            response: {
                status: 401
            },
            config: {
                url: '/user'
            }
        }

        await expect(handleApiClientError(error)).rejects.toBe(error)

        expect(clearClientSessionMock).toHaveBeenCalledTimes(1)
        expect(routerReplace).toHaveBeenCalledWith({ name: 'auth' })
    })

    it('does not clear session for auth request 401', async () => {
        hasStoredUserDataMock.mockReturnValue(true)
        currentRoute.value.name = 'auth'

        const error = {
            response: {
                status: 401
            },
            config: {
                url: '/auth/login'
            }
        }

        await expect(handleApiClientError(error)).rejects.toBe(error)

        expect(clearClientSessionMock).not.toHaveBeenCalled()
        expect(routerReplace).not.toHaveBeenCalled()
    })

    it('does not clear session for csrf cookie request 401', async () => {
        hasStoredUserDataMock.mockReturnValue(true)

        const error = {
            response: {
                status: 401
            },
            config: {
                url: '/sanctum/csrf-cookie'
            }
        }

        await expect(handleApiClientError(error)).rejects.toBe(error)

        expect(clearClientSessionMock).not.toHaveBeenCalled()
    })

    it('does not redirect on 401 when user data is missing', async () => {
        hasStoredUserDataMock.mockReturnValue(false)
        currentRoute.value.name = 'profile'

        const error = {
            response: {
                status: 401
            },
            config: {
                url: '/user'
            }
        }

        await expect(handleApiClientError(error)).rejects.toBe(error)

        expect(clearClientSessionMock).not.toHaveBeenCalled()
        expect(routerReplace).not.toHaveBeenCalled()
    })

    it('redirects to profile on 403', async () => {
        currentRoute.value.name = 'all-users'

        const error = {
            response: {
                status: 403
            },
            config: {
                url: '/user/all'
            }
        }

        await expect(handleApiClientError(error)).rejects.toBe(error)

        expect(routerReplace).toHaveBeenCalledWith({ name: 'profile' })
    })

    it('does not redirect on 403 when already on profile', async () => {
        currentRoute.value.name = 'profile'

        const error = {
            response: {
                status: 403
            },
            config: {
                url: '/user/all'
            }
        }

        await expect(handleApiClientError(error)).rejects.toBe(error)

        expect(routerReplace).not.toHaveBeenCalled()
    })
})