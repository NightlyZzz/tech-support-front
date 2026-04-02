import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import AuthView from '@/views/auth/AuthView.vue'
import ProfileView from '@/views/user/ProfileView.vue'
import HomeView from '@/views/HomeView.vue'
import { isAuthenticated } from '@/user/data'
import CreateTicketView from '@/views/ticket/CreateTicketView.vue'
import MyTicketsView from '@/views/ticket/MyTicketsView.vue'
import AllTicketsView from '@/views/ticket/AllTicketsView.vue'
import AllUsersView from '@/views/user/AllUsersView.vue'
import EditUserView from '@/views/user/EditUserView.vue'
import TicketLog from '@/views/ticket/TicketLog.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: { auth: false }
        },
        {
            path: '/auth',
            name: 'auth',
            component: AuthView,
            meta: { auth: false }
        },
        {
            path: '/profile',
            name: 'profile',
            component: ProfileView,
            meta: { auth: true }
        },
        {
            path: '/user/all',
            name: 'all-users',
            component: AllUsersView,
            meta: { auth: true }
        },
        {
            path: '/user/:id/edit',
            name: 'edit-user',
            component: EditUserView,
            meta: { auth: true }
        },
        {
            path: '/ticket/create',
            name: 'create-ticket',
            component: CreateTicketView,
            meta: { auth: true }
        },
        {
            path: '/ticket/my',
            name: 'my-tickets',
            component: MyTicketsView,
            meta: { auth: true }
        },
        {
            path: '/ticket/all',
            name: 'all-tickets',
            component: AllTicketsView,
            meta: { auth: true }
        },
        {
            path: '/ticket/:id',
            name: 'ticket',
            component: TicketLog,
            meta: { auth: true }
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
})

router.beforeEach((
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext
) => {
    const authenticated = isAuthenticated()
    const requiresAuth = to.meta.auth ?? false

    if (requiresAuth && !authenticated) {
        return next({ name: 'auth' })
    }

    if (authenticated && to.name === 'auth') {
        return next({ name: 'profile' })
    }

    if (to.name === 'home') {
        return next({ name: authenticated ? 'profile' : 'auth' })
    }

    next()
})

export default router