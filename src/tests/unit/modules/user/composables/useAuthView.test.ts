import { describe, expect, it, vi } from 'vitest'

const {
    routeQuery,
    routerReplaceMock,
    redirectToGoogleAuthMock,
    showToastMock
} = vi.hoisted(() => ({
    routeQuery: {} as Record<string, unknown>,
    routerReplaceMock: vi.fn(),
    redirectToGoogleAuthMock: vi.fn(),
    showToastMock: vi.fn()
}))

vi.mock('vue', async () => {
    const actual = await vi.importActual<typeof import('vue')>('vue')

    return {
        ...actual,
        onMounted: (callback: () => unknown) => {
            callback()
        }
    }
})

vi.mock('vue-router', () => ({
    useRoute: () => ({
        query: routeQuery
    }),
    useRouter: () => ({
        replace: routerReplaceMock
    })
}))

vi.mock('@/modules/user/services/auth.service', () => ({
    redirectToGoogleAuth: redirectToGoogleAuthMock
}))

vi.mock('@/shared/toast/toastService', () => ({
    showToast: showToastMock
}))

import { useAuthView } from '@/modules/user/composables/useAuthView'

describe('useAuthView', () => {
    it('uses login mode by default', () => {
        Object.keys(routeQuery).forEach((key) => delete routeQuery[key])

        const { isLogin, title, subtitle } = useAuthView()

        expect(isLogin.value).toBe(true)
        expect(title.value).toBe('Добро пожаловать')
        expect(subtitle.value).toBe('Войдите, чтобы продолжить работу в системе')
    })

    it('switches to register mode', () => {
        Object.keys(routeQuery).forEach((key) => delete routeQuery[key])

        const { isLogin, title, subtitle, setMode } = useAuthView()

        setMode('register')

        expect(isLogin.value).toBe(false)
        expect(title.value).toBe('Создать аккаунт')
        expect(subtitle.value).toBe('Заполните данные для регистрации нового аккаунта')
    })

    it('starts google auth when button handler is called', () => {
        Object.keys(routeQuery).forEach((key) => delete routeQuery[key])

        const { handleGoogleAuth } = useAuthView()

        handleGoogleAuth()

        expect(redirectToGoogleAuthMock).toHaveBeenCalledTimes(1)
    })

    it('shows toast on google callback error and clears query route', async () => {
        routeQuery.provider = 'google'
        routeQuery.status = 'error'

        useAuthView()

        await Promise.resolve()

        expect(routerReplaceMock).toHaveBeenCalledWith({ name: 'auth' })
        expect(showToastMock).toHaveBeenCalledWith('Не удалось выполнить вход через Google', 'error')
    })

    it('does nothing when callback status is not google error', async () => {
        routeQuery.provider = 'google'
        routeQuery.status = 'success'

        useAuthView()

        await Promise.resolve()

        expect(routerReplaceMock).not.toHaveBeenCalled()
        expect(showToastMock).not.toHaveBeenCalled()
    })
})