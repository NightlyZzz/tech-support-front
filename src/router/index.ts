import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/views/auth/AuthView.vue'
import ProfileView from '@/views/user/ProfileView.vue'
import HomeView from '@/views/HomeView.vue'
import { getUser, isAuthenticated } from '@/user/data.ts'
import { refreshAuthData } from '@/utils/utils'
import CreateTicketView from '@/views/ticket/CreateTicketView.vue'
import MyTicketsView from '@/views/ticket/MyTicketsView.vue'
import AllTicketsView from '@/views/ticket/AllTicketsView.vue'
import AllUsersView from '@/views/user/AllUsersView.vue'
import EditUserView from '@/views/user/EditUserView.vue'
import { Role } from '@/enums/role.ts'
import TicketLog from "@/views/ticket/TicketLog.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {auth: false}
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: {auth: false}
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        auth: true,
        role: Role.User
      }
    },
    {
      path: '/user/all',
      name: 'all-users',
      component: AllUsersView,
      meta: {
        auth: true,
        role: Role.Admin
      }
    },
    {
      path: '/user/:id/edit',
      name: 'edit-user',
      component: EditUserView,
      meta: {
        auth: true,
        role: Role.Admin
      }
    },
    {
      path: '/ticket/create',
      name: 'create-ticket',
      component: CreateTicketView,
      meta: {
        auth: true,
        role: Role.User
      }
    },
    {
      path: '/ticket/my',
      name: 'my-tickets',
      component: MyTicketsView,
      meta: {
        auth: true,
        role: Role.User
      }
    },
    {
      path: '/ticket/all',
      name: 'all-tickets',
      component: AllTicketsView,
      meta: {
        auth: true,
        role: Role.Employee
      }
    },
    {
      path: '/ticket/:id',
      name: 'ticket',
      component: TicketLog,
      meta: {
        auth: true,
        role: Role.User
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

router.beforeEach(async (to: any, from: any, next: any): Promise<any> => {
  const authenticated: boolean = isAuthenticated()
  const requiresAuth: boolean = to.meta.auth
  const requiredRole: number = to.meta.role

  let user = null

  if (authenticated) {
    user = getUser()
    if (user) {
      await refreshAuthData(user.getToken())
    }
  }

  if (requiresAuth && !authenticated) {
    return next({ name: 'auth' })
  }

  if (to.name === 'home') {
    return authenticated ? next({ name: 'profile' }) : next({ name: 'auth' })
  }

  if (to.name === 'auth' && authenticated) {
    return next({ name: 'profile' })
  }

  if (authenticated && user && requiredRole > user.getRole()) {
    return next({ name: 'home' })
  }

  return next()
})

export default router
