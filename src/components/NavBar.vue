<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { COMPANY_NAME } from '@/shared/utils/constants'
    import { useUser } from '@/modules/user/composables/useUser'
    import { logout } from '@/modules/user/services/auth.service'

    const mobileOpen = ref(false)
    const logoutModalOpen = ref(false)
    const logoutLoading = ref(false)

    const { user, isAdmin, isEmployee, isUser } = useUser()

    const isAuthenticated = computed(() => user.value !== null)

    const links = computed(() => {
        return [
            { name: 'Мои заявки', route: 'my-tickets', show: true },
            { name: 'Создать заявку', route: 'create-ticket', show: isUser.value },
            { name: 'Все заявки', route: 'all-tickets', show: isEmployee.value },
            { name: 'Пользователи', route: 'all-users', show: isAdmin.value }
        ].filter(link => link.show)
    })

    const toggleMobile = () => {
        mobileOpen.value = !mobileOpen.value
    }

    const closeMobile = () => {
        mobileOpen.value = false
    }

    const openLogoutModal = () => {
        logoutModalOpen.value = true
        closeMobile()
    }

    const closeLogoutModal = () => {
        if (logoutLoading.value) {
            return
        }

        logoutModalOpen.value = false
    }

    const handleLogout = async (allDevices: boolean) => {
        if (logoutLoading.value) {
            return
        }

        logoutLoading.value = true

        try {
            await logout(allDevices)
        } finally {
            logoutLoading.value = false
            logoutModalOpen.value = false
        }
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

        <div class="navbar-right" style="display:flex;align-items:center;gap:12px;">
            <router-link class="navbar-account" :to="{ name: 'profile' }">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
                Аккаунт
            </router-link>

            <button type="button" class="navbar-link" style="background:none;border:none;cursor:pointer;"
                    @click="openLogoutModal">
                Выйти
            </button>
        </div>

        <button class="navbar-toggle" @click="toggleMobile">
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

        <button
                type="button"
                class="navbar-link"
                style="background:none;border:none;text-align:left;cursor:pointer;"
                @click="openLogoutModal"
        >
            Выйти
        </button>
    </div>

    <div
            v-if="logoutModalOpen"
            style="position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;"
            @click.self="closeLogoutModal"
    >
        <div
                style="width:100%;max-width:420px;background:var(--c-bg);border:1px solid var(--c-border);border-radius:16px;padding:20px;box-shadow:0 16px 40px rgba(0,0,0,.2);"
        >
            <h3 style="margin:0 0 10px 0;">Выход из аккаунта</h3>
            <p style="margin:0 0 16px 0;line-height:1.5;">
                Хотите выйти только на текущем устройстве или на всех устройствах?
            </p>

            <div style="display:flex;flex-direction:column;gap:10px;">
                <button
                        type="button"
                        class="btn btn--primary btn--full"
                        :disabled="logoutLoading"
                        @click="handleLogout(false)"
                >
                    Выйти только на этом устройстве
                </button>

                <button
                        type="button"
                        class="btn btn--primary btn--full"
                        :disabled="logoutLoading"
                        @click="handleLogout(true)"
                >
                    Выйти на всех устройствах
                </button>

                <button
                        type="button"
                        class="btn btn--full"
                        :disabled="logoutLoading"
                        @click="closeLogoutModal"
                >
                    Отмена
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/navbar.css';
</style>