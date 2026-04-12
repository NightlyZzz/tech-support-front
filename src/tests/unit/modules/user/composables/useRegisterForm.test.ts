import { describe, expect, it, vi } from 'vitest'

const {
    routerReplace,
    registerMock,
    getAllDepartmentsMock,
    initializeAuthorizedSessionMock,
    showToastMock,
    getLaravelErrorMessageMock
} = vi.hoisted(() => ({
    routerReplace: vi.fn(),
    registerMock: vi.fn(),
    getAllDepartmentsMock: vi.fn(),
    initializeAuthorizedSessionMock: vi.fn(),
    showToastMock: vi.fn(),
    getLaravelErrorMessageMock: vi.fn()
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

vi.mock('@/router', () => ({
    default: {
        replace: routerReplace
    }
}))

vi.mock('@/modules/user/api/auth.api', () => ({
    register: registerMock
}))

vi.mock('@/modules/user/api/user.lookup', () => ({
    getAllDepartments: getAllDepartmentsMock
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

import { useRegisterForm } from '@/modules/user/composables/useRegisterForm'

describe('useRegisterForm', () => {
    it('loads departments on mount', async () => {
        getAllDepartmentsMock.mockResolvedValue({
            data: [
                { id: 1, name: 'Department One' },
                { id: 2, name: 'Department Two' }
            ]
        })

        const { departments } = useRegisterForm()

        await Promise.resolve()

        expect(getAllDepartmentsMock).toHaveBeenCalled()
        expect(departments.value).toEqual([
            { id: 1, name: 'Department One' },
            { id: 2, name: 'Department Two' }
        ])
    })

    it('shows toast when password is too short', async () => {
        getAllDepartmentsMock.mockResolvedValue({ data: [] })

        const { form, handleRegister } = useRegisterForm()

        form.password = '1234567'

        await handleRegister()

        expect(showToastMock).toHaveBeenCalledWith('Пароль должен содержать не менее 8 символов', 'error')
        expect(registerMock).not.toHaveBeenCalled()
    })

    it('shows toast when department is not selected', async () => {
        getAllDepartmentsMock.mockResolvedValue({ data: [] })

        const { form, handleRegister } = useRegisterForm()

        form.first_name = 'Ivan'
        form.last_name = 'Ivanov'
        form.middle_name = 'Ivanovich'
        form.email = 'user@gmail.com'
        form.password = 'password123'
        form.department_id = null

        await handleRegister()

        expect(showToastMock).toHaveBeenCalledWith('Выберите подразделение', 'error')
        expect(registerMock).not.toHaveBeenCalled()
    })

    it('registers user, initializes session and redirects to profile', async () => {
        getAllDepartmentsMock.mockResolvedValue({
            data: [{ id: 7, name: 'Department Seven' }]
        })
        registerMock.mockResolvedValue({ message: 'Пользователь успешно зарегистрирован' })
        initializeAuthorizedSessionMock.mockResolvedValue(undefined)

        const { form, handleRegister, isSubmitting } = useRegisterForm()

        form.first_name = ' Ivan '
        form.last_name = ' Ivanov '
        form.middle_name = ' Ivanovich '
        form.email = ' USER@GMAIL.COM '
        form.password = 'password123'
        form.department_id = 7
        form.remember = true

        await handleRegister()

        expect(registerMock).toHaveBeenCalledWith({
            first_name: 'Ivan',
            last_name: 'Ivanov',
            middle_name: 'Ivanovich',
            email: 'user@gmail.com',
            password: 'password123',
            department_id: 7,
            remember: true
        })
        expect(initializeAuthorizedSessionMock).toHaveBeenCalledWith()
        expect(routerReplace).toHaveBeenCalledWith({ name: 'profile' })
        expect(isSubmitting.value).toBe(false)
    })

    it('shows toast when registration fails', async () => {
        const registerError = new Error('Register failed')

        getAllDepartmentsMock.mockResolvedValue({
            data: [{ id: 3, name: 'Department Three' }]
        })
        registerMock.mockRejectedValue(registerError)
        getLaravelErrorMessageMock.mockReturnValue('Ошибка регистрации с сервера')

        const { form, handleRegister, isSubmitting } = useRegisterForm()

        form.first_name = 'Ivan'
        form.last_name = 'Ivanov'
        form.middle_name = 'Ivanovich'
        form.email = 'user@gmail.com'
        form.password = 'password123'
        form.department_id = 3

        await handleRegister()

        expect(showToastMock).toHaveBeenCalledWith('Ошибка регистрации с сервера', 'error')
        expect(initializeAuthorizedSessionMock).not.toHaveBeenCalled()
        expect(isSubmitting.value).toBe(false)
    })
})