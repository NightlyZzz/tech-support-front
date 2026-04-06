import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import AuthView from '@/views/auth/AuthView.vue'
import ProfileView from '@/views/user/ProfileView.vue'
import HomeView from '@/views/HomeView.vue'
import CreateTicketView from '@/views/ticket/CreateTicketView.vue'
import MyTicketsView from '@/views/ticket/MyTicketsView.vue'
import AllTicketsView from '@/views/ticket/AllTicketsView.vue'
import AllUsersView from '@/views/user/AllUsersView.vue'
import EditUserView from '@/views/user/EditUserView.vue'
import TicketLog from '@/views/ticket/TicketLog.vue'
import { Role } from '@/enums/role'
import { getUserToken } from '@/modules/user/model/userStorage'
import { getUser } from '@/modules/user/model/userState'

type RouteRole = 'admin' | 'employee' | 'user'

const getDefaultAuthorizedRouteName = () => {
    return 'profile'
}

const hasRouteAccess = (routeLocation: RouteLocationNormalized): boolean => {
    const requiredRole = routeLocation.meta.role as RouteRole | undefined

    if (!requiredRole) {
        return true
    }

    const currentUser = getUser().value

    if (!currentUser) {
        return false
    }

    const currentUserRole = currentUser.getRole()

    if (requiredRole === 'admin') {
        return currentUserRole === Role.Admin
    }

    if (requiredRole === 'employee') {
        return currentUserRole >= Role.Employee
    }

    if (requiredRole === 'user') {
        return currentUserRole === Role.User
    }

    return true
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/home',
            redirect: '/'
        },
        {
            path: '/auth',
            name: 'auth',
            component: AuthView
        },
        {
            path: '/profile',
            name: 'profile',
            component: ProfileView,
            meta: { requiresAuth: true }
        },
        {
            path: '/ticket/create',
            name: 'create-ticket',
            component: CreateTicketView,
            meta: { requiresAuth: true, role: 'user' }
        },
        {
            path: '/ticket/my',
            name: 'my-tickets',
            component: MyTicketsView,
            meta: { requiresAuth: true }
        },
        {
            path: '/ticket/all',
            name: 'all-tickets',
            component: AllTicketsView,
            meta: { requiresAuth: true, role: 'employee' }
        },
        {
            path: '/user/all',
            name: 'all-users',
            component: AllUsersView,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/user/:id/edit',
            name: 'edit-user',
            component: EditUserView,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/ticket/:id',
            name: 'ticket',
            component: TicketLog,
            meta: { requiresAuth: true }
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: () => {
                return getUserToken() ? { name: getDefaultAuthorizedRouteName() } : { name: 'auth' }
            }
        }
    ]
})

router.beforeEach((routeLocation) => {
    const hasToken = !!getUserToken()
    const requiresAuth = !!routeLocation.meta.requiresAuth

    if (routeLocation.name === 'home') {
        return hasToken ? { name: getDefaultAuthorizedRouteName() } : { name: 'auth' }
    }

    if (requiresAuth && !hasToken) {
        return { name: 'auth' }
    }

    if (routeLocation.name === 'auth' && hasToken) {
        return { name: getDefaultAuthorizedRouteName() }
    }

    if (!hasRouteAccess(routeLocation)) {
        return { name: getDefaultAuthorizedRouteName() }
    }

    return true
})

export default router