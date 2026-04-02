import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/auth/AuthView.vue'
import ProfileView from '@/views/user/ProfileView.vue'
import HomeView from '@/views/HomeView.vue'
import { isAuthenticated } from '@/user/data.ts'
import { refreshAuthData } from '@/utils/utils'
import CreateTicketView from '@/views/ticket/CreateTicketView.vue'
import MyTicketsView from '@/views/ticket/MyTicketsView.vue'
import AllTicketsView from '@/views/ticket/AllTicketsView.vue'
import AllUsersView from '@/views/user/AllUsersView.vue'
import EditUserView from '@/views/user/EditUserView.vue'
import TicketLog from '@/views/ticket/TicketLog.vue'
import { useAuth } from '@/composables/auth/useAuth'
import type { User } from '@/user/user.ts'

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

router.beforeEach(async (to: any, from: any, next: any): Promise<any> => {
  const authenticated: boolean = isAuthenticated()
  const requiresAuth: boolean = to.meta.auth ?? false

  let currentUser: User | null = null

  if (authenticated) {
    const { user } = useAuth()
    currentUser = user.value

    if (currentUser) {
      await refreshAuthData(currentUser.getToken())
    }
  }

  if (requiresAuth && !authenticated) {
    return next({ name: 'auth' })
  }

  if (to.name === 'home') {
    if (authenticated) {
      return next({ name: 'profile' })
    }

    return next({ name: 'auth' })
  }

  if (to.name === 'auth' && authenticated) {
    return next({ name: 'profile' })
  }

  return next()
})

export default router
