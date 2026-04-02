<template>
    <nav class="navbar">
        <router-link class="navbar-brand" :to="{ name: 'home' }">
            <span class="navbar-brand-dot"></span>
            <span class="navbar-brand-name">{{ COMPANY_NAME }}</span>
        </router-link>

        <div class="navbar-links">
            <router-link class="navbar-link" :to="{ name: 'my-tickets' }">
                Мои заявки
            </router-link>
            <router-link class="navbar-link" :to="{ name: 'create-ticket' }" v-if="isUser">
                Создать заявку
            </router-link>
            <router-link class="navbar-link" :to="{ name: 'all-tickets' }" v-if="isEmployee">
                Все заявки
            </router-link>
            <router-link class="navbar-link" :to="{ name: 'all-users' }" v-if="isAdmin">
                Пользователи
            </router-link>
        </div>

        <div class="navbar-right">
            <router-link class="navbar-account" :to="{ name: 'profile' }">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                     stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Аккаунт
            </router-link>
        </div>

        <button class="navbar-toggle" @click="mobileOpen = !mobileOpen" aria-label="Меню">
            <span :style="mobileOpen ? 'transform:rotate(45deg) translate(5px,5px)' : ''"></span>
            <span :style="mobileOpen ? 'opacity:0' : ''"></span>
            <span :style="mobileOpen ? 'transform:rotate(-45deg) translate(5px,-5px)' : ''"></span>
        </button>
    </nav>

    <div :class="['navbar-drawer', mobileOpen ? 'open' : '']">
        <router-link class="navbar-link" :to="{ name: 'my-tickets' }" @click="mobileOpen = false">
            Мои заявки
        </router-link>
        <router-link class="navbar-link" :to="{ name: 'create-ticket' }" v-if="isUser"
                     @click="mobileOpen = false">
            Создать заявку
        </router-link>
        <router-link class="navbar-link" :to="{ name: 'all-tickets' }" v-if="isEmployee"
                     @click="mobileOpen = false">
            Все заявки
        </router-link>
        <router-link class="navbar-link" :to="{ name: 'all-users' }" v-if="isAdmin"
                     @click="mobileOpen = false">
            Пользователи
        </router-link>
        <div style="height:1px;background:var(--c-border);margin:4px 0;"></div>
        <router-link class="navbar-link" :to="{ name: 'profile' }" @click="mobileOpen = false">
            Аккаунт
        </router-link>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useAuth } from '@/composables/auth/useAuth'
    import { COMPANY_NAME } from '@/utils/constants'

    const mobileOpen = ref(false)

    const { isAdmin, isEmployee, isUser } = useAuth()
</script>

<style scoped>
    @import '@/assets/navbar.css';
</style>
