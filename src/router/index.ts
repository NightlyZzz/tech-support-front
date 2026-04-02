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
import { getUserToken } from '@/user/data'

const getUserData = () => {
    const data = localStorage.getItem('user_data')
    return data ? JSON.parse(data) : null
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

        { path: '/auth', name: 'auth', component: AuthView },

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
                const token = localStorage.getItem('token')
                return token ? '/profile' : '/auth'
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const token = getUserToken()
    const isAuth = !!token
    const userData = getUserData()

    if (to.meta.requiresAuth && !isAuth) {
        return next({ name: 'auth' })
    }

    if (to.name === 'home') {
        return next(isAuth ? { name: 'profile' } : { name: 'auth' })
    }

    if (to.name === 'auth' && isAuth) {
        return next({ name: 'profile' })
    }

    const role = to.meta.role

    if (role && userData) {
        const userRole = userData.role_id

        if (role === 'admin' && userRole !== Role.Admin) {
            return next({ name: 'profile' })
        }

        if (role === 'employee' && userRole < Role.Employee) {
            return next({ name: 'profile' })
        }

        if (role === 'user' && userRole !== Role.User) {
            return next({ name: 'profile' })
        }
    }

    next()
})

export default router