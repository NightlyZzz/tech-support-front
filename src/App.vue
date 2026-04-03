<script setup lang="ts">
    import { computed, onMounted, onUnmounted, watch } from 'vue'
    import NavBar from '@/components/NavBar.vue'
    import BaseToast from '@/components/BaseToast.vue'
    import { getUser, initUser } from '@/user/data'
    import router from '@/router'
    import { Role } from '@/enums/role'

    const userRef = getUser()

    const isAuthenticated = computed(() => !!userRef.value)

    let interval: any = null

    onMounted(() => {
        interval = setInterval(() => {
            initUser()
        }, 5000)
    })

    onUnmounted(() => {
        if (interval) {
            clearInterval(interval)
        }
    })

    watch(userRef, (user) => {
        if (!user) {
            return
        }

        const route = router.currentRoute.value
        const role = route.meta.role

        if (!role) {
            return
        }

        const userRole = user.getRole()

        let hasAccess = true

        if (role === 'admin') {
            hasAccess = userRole === Role.Admin
        }

        if (role === 'employee') {
            hasAccess = userRole >= Role.Employee
        }

        if (role === 'user') {
            hasAccess = userRole === Role.User
        }

        if (!hasAccess && route.name !== 'profile') {
            router.replace({ name: 'profile' })
        }
    })
</script>

<template>
    <div id="app">
        <NavBar v-if="isAuthenticated"/>

        <RouterView v-slot="{ Component }">
            <Transition name="page" mode="out-in">
                <component :is="Component" :key="$route.fullPath"/>
            </Transition>
        </RouterView>

        <BaseToast/>
    </div>
</template>