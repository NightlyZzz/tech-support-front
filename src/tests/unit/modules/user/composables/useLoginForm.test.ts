import { describe, expect, it, vi } from 'vitest'

const {
    routerReplace,
    loginMock,
    initializeAuthorizedSessionMock,
    showToastMock,
    getLaravelErrorMessageMock
} = vi.hoisted(() => ({
    routerReplace: vi.fn(),
    loginMock: vi.fn(),
    initializeAuthorizedSessionMock: vi.fn(),
    showToastMock: vi.fn(),
    getLaravelErrorMessageMock: vi.fn()
}))

vi.mock('@/router', () => ({
    default: {
        replace: routerReplace
    }
}))

vi.mock('@/modules/user/api/auth.api', () => ({
    login: loginMock
}))

vi.mock('@/modules/user/services/session.service', () => ({
    initializeAuthorizedSession: initializeAuthorizedSessionMock
}))

vi.mock('@/shared/toast/toastService', () => ({
    showToast: showToastMock
}))

vi.mock('@/modules/user/helpers/getLaravelErrorMessage', () => ({
    getLaravelErrorMessage: getLaravelErrorMessageMock
}))

import { useLoginForm } from '@/modules/user/composables/useLoginForm'

describe('useLoginForm', () => {
    it('logs in user with normalized email and redirects to profile', async () => {
        loginMock.mockResolvedValue({ message: 'Успешный вход' })
        initializeAuthorizedSessionMock.mockResolvedValue(undefined)

        const { form, handleLogin, isSubmitting } = useLoginForm()

        form.email = '  USER@GMAIL.COM '
        form.password = 'password123'
        form.remember = true

        await handleLogin()

        expect(loginMock).toHaveBeenCalledWith({
            email: 'user@gmail.com',
            password: 'password123',
            remember: true
        })
        expect(initializeAuthorizedSessionMock).toHaveBeenCalledWith()
        expect(routerReplace).toHaveBeenCalledWith({ name: 'profile' })
        expect(isSubmitting.value).toBe(false)
    })

    it('does not submit twice while request is already in progress', async () => {
        const { handleLogin, isSubmitting } = useLoginForm()

        isSubmitting.value = true

        await handleLogin()

        expect(loginMock).not.toHaveBeenCalled()
        expect(initializeAuthorizedSessionMock).not.toHaveBeenCalled()
    })

    it('shows toast when login fails', async () => {
        const loginError = new Error('Login failed')

        loginMock.mockRejectedValue(loginError)
        getLaravelErrorMessageMock.mockReturnValue('Неверный логин')

        const { form, handleLogin, isSubmitting } = useLoginForm()

        form.email = 'user@gmail.com'
        form.password = 'wrong-password'

        await handleLogin()

        expect(showToastMock).toHaveBeenCalledWith('Неверный логин', 'error')
        expect(routerReplace).not.toHaveBeenCalled()
        expect(isSubmitting.value).toBe(false)
    })

    it('shows fallback toast when helper returns null', async () => {
        const loginError = new Error('Login failed')

        loginMock.mockRejectedValue(loginError)
        getLaravelErrorMessageMock.mockReturnValue(null)

        const { form, handleLogin } = useLoginForm()

        form.email = 'user@gmail.com'
        form.password = 'wrong-password'

        await handleLogin()

        expect(showToastMock).toHaveBeenCalledWith('Неверный email или пароль', 'error')
    })
})