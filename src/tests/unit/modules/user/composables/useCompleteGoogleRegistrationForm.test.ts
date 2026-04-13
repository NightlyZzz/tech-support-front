import { describe, expect, it, vi } from 'vitest'

const {
    routerReplaceMock,
    completeGoogleRegistrationMock,
    getAllDepartmentsMock,
    initializeAuthorizedSessionMock,
    showToastMock,
    getLaravelErrorMessageMock
} = vi.hoisted(() => ({
    routerReplaceMock: vi.fn(),
    completeGoogleRegistrationMock: vi.fn(),
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

vi.mock('vue-router', () => ({
    useRouter: () => ({
        replace: routerReplaceMock
    })
}))

vi.mock('@/modules/user/api/auth.api', () => ({
    completeGoogleRegistration: completeGoogleRegistrationMock
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

import { useCompleteGoogleRegistrationForm } from '@/modules/user/composables/useCompleteGoogleRegistrationForm'

describe('useCompleteGoogleRegistrationForm', () => {
    it('loads departments on mount', async () => {
        getAllDepartmentsMock.mockResolvedValue({
            data: [
                { id: 1, name: 'Department One' },
                { id: 2, name: 'Department Two' }
            ]
        })

        const { departments } = useCompleteGoogleRegistrationForm()

        await Promise.resolve()

        expect(getAllDepartmentsMock).toHaveBeenCalledTimes(1)
        expect(departments.value).toEqual([
            { id: 1, name: 'Department One' },
            { id: 2, name: 'Department Two' }
        ])
    })

    it('shows toast when department is not selected', async () => {
        getAllDepartmentsMock.mockResolvedValue({ data: [] })

        const { form, handleSubmit } = useCompleteGoogleRegistrationForm()

        form.password = 'password123'

        await handleSubmit()

        expect(showToastMock).toHaveBeenCalledWith('Выберите подразделение', 'error')
        expect(completeGoogleRegistrationMock).not.toHaveBeenCalled()
    })

    it('shows toast when password is too short', async () => {
        getAllDepartmentsMock.mockResolvedValue({ data: [] })

        const { form, handleSubmit } = useCompleteGoogleRegistrationForm()

        form.department_id = 5
        form.password = '1234567'

        await handleSubmit()

        expect(showToastMock).toHaveBeenCalledWith('Пароль должен содержать не менее 8 символов', 'error')
        expect(completeGoogleRegistrationMock).not.toHaveBeenCalled()
    })

    it('submits form, initializes session and redirects to profile', async () => {
        getAllDepartmentsMock.mockResolvedValue({
            data: [{ id: 7, name: 'Department Seven' }]
        })
        completeGoogleRegistrationMock.mockResolvedValue({
            message: 'Регистрация через Google успешно завершена'
        })
        initializeAuthorizedSessionMock.mockResolvedValue(undefined)

        const { form, handleSubmit, isSubmitting } = useCompleteGoogleRegistrationForm()

        form.department_id = 7
        form.password = 'password123'

        await handleSubmit()

        expect(completeGoogleRegistrationMock).toHaveBeenCalledWith({
            department_id: 7,
            password: 'password123'
        })
        expect(initializeAuthorizedSessionMock).toHaveBeenCalledWith()
        expect(routerReplaceMock).toHaveBeenCalledWith({ name: 'profile' })
        expect(isSubmitting.value).toBe(false)
    })

    it('shows toast when completion request fails', async () => {
        getAllDepartmentsMock.mockResolvedValue({
            data: [{ id: 3, name: 'Department Three' }]
        })
        completeGoogleRegistrationMock.mockRejectedValue(new Error('Complete failed'))
        getLaravelErrorMessageMock.mockReturnValue('Ошибка завершения регистрации')

        const { form, handleSubmit, isSubmitting } = useCompleteGoogleRegistrationForm()

        form.department_id = 3
        form.password = 'password123'

        await handleSubmit()

        expect(showToastMock).toHaveBeenCalledWith('Ошибка завершения регистрации', 'error')
        expect(initializeAuthorizedSessionMock).not.toHaveBeenCalled()
        expect(isSubmitting.value).toBe(false)
    })
})