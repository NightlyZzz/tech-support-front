<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { COMPANY_NAME } from '@/shared/utils/constants'
    import { useUser } from '@/modules/user/composables/useUser'

    const mobileOpen = ref(false)

    const { user, isAdmin, isEmployee, isUser } = useUser()

    const isAuthenticated = computed(() => !!user.value)

    const links = computed(() => {
        const items = [
            { name: 'Мои заявки', route: 'my-tickets', show: true },
            { name: 'Создать заявку', route: 'create-ticket', show: isUser.value },
            { name: 'Все заявки', route: 'all-tickets', show: isEmployee.value },
            { name: 'Пользователи', route: 'all-users', show: isAdmin.value }
        ]

        return items.filter(i => i.show)
    })

    const closeMobile = () => {
        mobileOpen.value = false
    }
</script>

<template>
    <nav v-if="isAuthenticated" class="navbar">
        <router-link class="navbar-brand" :to="{ name: 'home' }">
            <span class="navbar-brand-dot"></span>
            <span class="navbar-brand-name">{{ COMPANY_NAME }}</span>
        </router-link>

        <div class="navbar-links">
            <router-link
                    v-for="link in links"
                    :key="link.route"
                    class="navbar-link"
                    :to="{ name: link.route }"
            >
                {{ link.name }}
            </router-link>
        </div>

        <div class="navbar-right">
            <router-link class="navbar-account" :to="{ name: 'profile' }">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Аккаунт
            </router-link>
        </div>

        <button class="navbar-toggle" @click="mobileOpen = !mobileOpen">
            <span :style="mobileOpen ? 'transform:rotate(45deg) translate(5px,5px)' : ''"></span>
            <span :style="mobileOpen ? 'opacity:0' : ''"></span>
            <span :style="mobileOpen ? 'transform:rotate(-45deg) translate(5px,-5px)' : ''"></span>
        </button>
    </nav>

    <div v-if="isAuthenticated" :class="['navbar-drawer', mobileOpen ? 'open' : '']">
        <router-link
                v-for="link in links"
                :key="link.route"
                class="navbar-link"
                :to="{ name: link.route }"
                @click="closeMobile"
        >
            {{ link.name }}
        </router-link>

        <div style="height:1px;background:var(--c-border);margin:4px 0;"></div>

        <router-link
                class="navbar-link"
                :to="{ name: 'profile' }"
                @click="closeMobile"
        >
            Аккаунт
        </router-link>
    </div>
</template>

<style scoped>
    @import '@/assets/navbar.css';
</style>