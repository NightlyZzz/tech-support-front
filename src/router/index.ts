import { createRouter, createWebHistory } from 'vue-router'
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
                return getUserToken() ? '/profile' : '/auth'
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const token = getUserToken()
    const isAuthenticated = !!token
    const currentUser = getUser().value
    const requiredRole = to.meta.role

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next({ name: 'auth' })
    }

    if (to.name === 'home') {
        return next(isAuthenticated ? { name: 'profile' } : { name: 'auth' })
    }

    if (to.name === 'auth' && isAuthenticated) {
        return next({ name: 'profile' })
    }

    if (!requiredRole) {
        return next()
    }

    if (!currentUser) {
        return next({ name: 'profile' })
    }

    const currentUserRole = currentUser.getRole()

    if (requiredRole === 'admin' && currentUserRole !== Role.Admin) {
        return next({ name: 'profile' })
    }

    if (requiredRole === 'employee' && currentUserRole < Role.Employee) {
        return next({ name: 'profile' })
    }

    if (requiredRole === 'user' && currentUserRole !== Role.User) {
        return next({ name: 'profile' })
    }

    next()
})

export default router