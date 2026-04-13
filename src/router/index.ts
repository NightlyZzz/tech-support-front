import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/auth/AuthView.vue'
import CompleteGoogleRegistrationView from '@/views/auth/CompleteGoogleRegistrationView.vue'
import ProfileView from '@/views/user/ProfileView.vue'
import HomeView from '@/views/HomeView.vue'
import CreateTicketView from '@/views/ticket/CreateTicketView.vue'
import MyTicketsView from '@/views/ticket/MyTicketsView.vue'
import AllTicketsView from '@/views/ticket/AllTicketsView.vue'
import AllUsersView from '@/views/user/AllUsersView.vue'
import EditUserView from '@/views/user/EditUserView.vue'
import TicketLog from '@/views/ticket/TicketLog.vue'
import { getUser } from '@/modules/user/model/userState'
import { resolveNavigationGuard } from '@/router/guard'

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
            path: '/auth/google/complete',
            name: 'google-registration-complete',
            component: CompleteGoogleRegistrationView,
            meta: { requiresAuth: true }
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
                return getUser().value ? { name: 'profile' } : { name: 'auth' }
            }
        }
    ]
})

router.beforeEach((routeLocation) => {
    return resolveNavigationGuard(routeLocation, {
        hasToken: Boolean(getUser().value),
        currentUser: getUser().value
    })
})

export default router