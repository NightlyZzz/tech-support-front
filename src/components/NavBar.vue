<script setup lang="ts">
    import { computed, ref, watch } from 'vue'
    import { useRoute } from 'vue-router'
    import { Menu, PlusCircle, Ticket, User, Users } from 'lucide-vue-next'
    import { Button } from '@/components/ui/button'
    import ThemeToggleButton from '@/components/common/ThemeToggleButton.vue'
    import {
        Sheet,
        SheetContent,
        SheetDescription,
        SheetHeader,
        SheetTitle
    } from '@/components/ui/sheet'
    import { Separator } from '@/components/ui/separator'
    import { cn } from '@/lib/utils'
    import { COMPANY_NAME } from '@/shared/utils/constants'
    import { useUser } from '@/modules/user/composables/useUser'

    type NavigationLink = {
        name: string
        route: string
        show: boolean
        icon: unknown
    }

    const route = useRoute()
    const mobileOpen = ref(false)

    const { user, isAdmin, isEmployee, isUser } = useUser()

    const isAuthenticated = computed(() => user.value !== null)

    const links = computed<NavigationLink[]>(() => {
        return [
            { name: 'Мои заявки', route: 'my-tickets', show: true, icon: Ticket },
            { name: 'Создать заявку', route: 'create-ticket', show: isUser.value, icon: PlusCircle },
            { name: 'Все заявки', route: 'all-tickets', show: isEmployee.value, icon: Ticket },
            { name: 'Пользователи', route: 'all-users', show: isAdmin.value, icon: Users }
        ].filter((linkItem) => linkItem.show)
    })

    const closeMobile = (): void => {
        mobileOpen.value = false
    }

    const getLinkClasses = (routeName: string): string => {
        const isActive = route.name === routeName

        return cn(
                'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )
    }

    watch(
            () => route.fullPath,
            () => {
                closeMobile()
            }
    )
</script>

<template>
    <header
            v-if="isAuthenticated"
            class="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur-xl"
    >
        <div class="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <router-link
                    :to="{ name: 'home' }"
                    class="flex min-w-0 items-center gap-3"
            >
                <span class="size-3 shrink-0 rounded-full bg-primary shadow-[0_0_24px_rgba(0,0,0,0.18)] dark:shadow-[0_0_24px_rgba(255,255,255,0.18)]"></span>
                <span class="truncate text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    {{ COMPANY_NAME }}
                </span>
            </router-link>

            <nav class="hidden items-center gap-1 lg:flex">
                <router-link
                        v-for="linkItem in links"
                        :key="linkItem.route"
                        :to="{ name: linkItem.route }"
                        :class="getLinkClasses(linkItem.route)"
                >
                    <component :is="linkItem.icon" class="size-4"/>
                    {{ linkItem.name }}
                </router-link>
            </nav>

            <div class="flex items-center gap-2">
                <ThemeToggleButton/>

                <router-link
                        :to="{ name: 'profile' }"
                        class="hidden sm:inline-flex"
                        :class="getLinkClasses('profile')"
                >
                    <User class="size-4"/>
                    Аккаунт
                </router-link>

                <Sheet v-model:open="mobileOpen">
                    <Button
                            variant="outline"
                            size="icon"
                            type="button"
                            class="lg:hidden"
                            @click="mobileOpen = true"
                    >
                        <Menu class="size-5"/>
                    </Button>

                    <SheetContent side="right" class="w-[320px] sm:w-[360px]">
                        <SheetHeader>
                            <SheetTitle>{{ COMPANY_NAME }}</SheetTitle>
                            <SheetDescription>
                                Навигация по системе
                            </SheetDescription>
                        </SheetHeader>

                        <div class="mt-6 flex flex-col gap-2">
                            <router-link
                                    v-for="linkItem in links"
                                    :key="linkItem.route"
                                    :to="{ name: linkItem.route }"
                                    :class="getLinkClasses(linkItem.route)"
                            >
                                <component :is="linkItem.icon" class="size-4"/>
                                {{ linkItem.name }}
                            </router-link>

                            <Separator class="my-2"/>

                            <router-link
                                    :to="{ name: 'profile' }"
                                    :class="getLinkClasses('profile')"
                            >
                                <User class="size-4"/>
                                Аккаунт
                            </router-link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </header>
</template>