import { describe, expect, it } from 'vitest'
import { Role } from '@/enums/role'
import { User } from '@/modules/user/model/user'
import type { UserData } from '@/modules/user/types/user'
import {
    getAuthRoute,
    getDefaultAuthorizedRoute,
    hasRouteAccess,
    resolveNavigationGuard
} from '@/router/guard'

const createUser = (roleId: Role): User => {
    const userData: UserData = {
        id: 1,
        email: 'user@example.com',
        first_name: 'Ivan',
        last_name: 'Ivanov',
        middle_name: 'Ivanovich',
        secondary_email: null,
        role_id: roleId,
        role_name: roleId === Role.Admin ? 'Администратор' : roleId === Role.Employee ? 'Сотрудник' : 'Пользователь',
        department_id: 1,
        department_name: 'Department'
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