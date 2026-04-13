import { describe, expect, it } from 'vitest'
import { Role } from '@/enums/role'
import { User } from '@/modules/user/model/user'
import type { UserData } from '@/modules/user/types/user'
import {
    getAuthRoute,
    getDefaultAuthorizedRoute,
    getGoogleCompletionRoute,
    hasRouteAccess,
    resolveNavigationGuard
} from '@/router/guard'

const createUser = (
        roleId: Role,
        requiresGoogleRegistrationCompletion = false
): User => {
    const userData: UserData = {
        id: 1,
        email: 'user@example.com',
        first_name: 'Ivan',
        last_name: 'Ivanov',
        middle_name: 'Ivanovich',
        secondary_email: null,
        role_id: roleId,
        role_name: roleId === Role.Admin ? 'Администратор' : roleId === Role.Employee ? 'Сотрудник' : 'Пользователь',
        department_id: requiresGoogleRegistrationCompletion ? null : 1,
        department_name: requiresGoogleRegistrationCompletion ? '' : 'Department',
        requires_google_registration_completion: requiresGoogleRegistrationCompletion
    }

    return User.fromApi(userData)
}

describe('router guard', () => {
    it('redirects guest from home to auth', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'home',
                    meta: {}
                } as never,
                {
                    hasToken: false,
                    currentUser: null
                }
        )

        expect(result).toEqual(getAuthRoute())
    })

    it('redirects authorized user from home to profile', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'home',
                    meta: {}
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.User)
                }
        )

        expect(result).toEqual(getDefaultAuthorizedRoute())
    })

    it('redirects authorized incomplete google user from home to completion page', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'home',
                    meta: {}
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.User, true)
                }
        )

        expect(result).toEqual(getGoogleCompletionRoute())
    })

    it('redirects guest from protected route to auth', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'profile',
                    meta: {
                        requiresAuth: true
                    }
                } as never,
                {
                    hasToken: false,
                    currentUser: null
                }
        )

        expect(result).toEqual(getAuthRoute())
    })

    it('redirects authorized user away from auth page', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'auth',
                    meta: {}
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.User)
                }
        )

        expect(result).toEqual(getDefaultAuthorizedRoute())
    })

    it('redirects incomplete google user away from auth page to completion page', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'auth',
                    meta: {}
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.User, true)
                }
        )

        expect(result).toEqual(getGoogleCompletionRoute())
    })

    it('allows user on own role route', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'create-ticket',
                    meta: {
                        requiresAuth: true,
                        role: 'user'
                    }
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.User)
                }
        )

        expect(result).toBe(true)
    })

    it('redirects default user from employee route', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'all-tickets',
                    meta: {
                        requiresAuth: true,
                        role: 'employee'
                    }
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.User)
                }
        )

        expect(result).toEqual(getDefaultAuthorizedRoute())
    })

    it('allows employee on employee route', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'all-tickets',
                    meta: {
                        requiresAuth: true,
                        role: 'employee'
                    }
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.Employee)
                }
        )

        expect(result).toBe(true)
    })

    it('allows admin on admin route', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'all-users',
                    meta: {
                        requiresAuth: true,
                        role: 'admin'
                    }
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.Admin)
                }
        )

        expect(result).toBe(true)
    })

    it('redirects employee from admin route', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'all-users',
                    meta: {
                        requiresAuth: true,
                        role: 'admin'
                    }
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.Employee)
                }
        )

        expect(result).toEqual(getDefaultAuthorizedRoute())
    })

    it('redirects incomplete google user from protected route to completion page', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'profile',
                    meta: {
                        requiresAuth: true
                    }
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.User, true)
                }
        )

        expect(result).toEqual(getGoogleCompletionRoute())
    })

    it('allows incomplete google user on completion page', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'google-registration-complete',
                    meta: {
                        requiresAuth: true
                    }
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.User, true)
                }
        )

        expect(result).toBe(true)
    })

    it('redirects completed user away from completion page', () => {
        const result = resolveNavigationGuard(
                {
                    name: 'google-registration-complete',
                    meta: {
                        requiresAuth: true
                    }
                } as never,
                {
                    hasToken: true,
                    currentUser: createUser(Role.User)
                }
        )

        expect(result).toEqual(getDefaultAuthorizedRoute())
    })

    it('hasRouteAccess returns false without user for protected role route', () => {
        const result = hasRouteAccess(
                {
                    meta: {
                        role: 'admin'
                    }
                } as never,
                null
        )

        expect(result).toBe(false)
    })
})