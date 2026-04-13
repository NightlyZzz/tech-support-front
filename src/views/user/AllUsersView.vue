<script setup lang="ts">
    import { Search, Shield, UserRound, Users } from 'lucide-vue-next'
    import { useUsersPage } from '@/modules/user/composables/useUsersPage'
    import BasePagination from '@/components/base/BasePagination.vue'
    import { Badge } from '@/components/ui/badge'
    import { Card, CardContent } from '@/components/ui/card'
    import { Input } from '@/components/ui/input'
    import { cn } from '@/lib/utils'

    const {
        searchQuery,
        visibleUsers,
        totalUsers,
        currentPage,
        lastPage,
        openUser,
        getInitials,
        isCurrentUser,
        getRoleClass
    } = useUsersPage()

    const getUserCardClasses = (userItem: { getRoleName: () => string }) => {
        const roleClass = getRoleClass(userItem as never)

        return cn(
                'group cursor-pointer rounded-3xl border border-border/80 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md',
                roleClass === 'admin' && 'border-violet-500/20',
                roleClass === 'employee' && 'border-blue-500/20'
        )
    }

    const getAvatarClasses = (userItem: { getRoleName: () => string }) => {
        const roleClass = getRoleClass(userItem as never)

        return cn(
                'flex size-14 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold',
                roleClass === 'admin' && 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
                roleClass === 'employee' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                roleClass !== 'admin' && roleClass !== 'employee' && 'bg-primary/10 text-primary'
        )
    }
</script>

<template>
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section class="rounded-3xl border bg-card/95 p-6 shadow-sm">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div class="flex items-start gap-4">
                    <div class="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Users class="size-7"/>
                    </div>

                    <div class="space-y-3">
                        <div class="space-y-1">
                            <h1 class="text-3xl font-semibold tracking-tight">
                                Пользователи
                            </h1>
                            <p class="text-sm text-muted-foreground">
                                Список сотрудников и пользователей системы с быстрым переходом к редактированию
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-2">
                            <Badge variant="secondary" class="rounded-full px-3 py-1">
                                {{ totalUsers }} чел.
                            </Badge>

                            <Badge variant="secondary" class="rounded-full px-3 py-1">
                                Администрирование аккаунтов
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="rounded-3xl border bg-card p-5 shadow-sm">
            <div class="max-w-md">
                <div class="relative">
                    <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>

                    <Input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Поиск по ФИО"
                            class="pl-10"
                    />
                </div>
            </div>
        </section>

        <div
                v-if="visibleUsers.length === 0"
                class="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed bg-card px-6 py-10 text-center shadow-sm"
        >
            <div class="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <Search class="size-7"/>
            </div>

            <div class="space-y-1">
                <h3 class="text-lg font-semibold">
                    Пользователи не найдены
                </h3>
                <p class="text-sm text-muted-foreground">
                    Попробуйте изменить поисковый запрос
                </p>
            </div>
        </div>

        <div v-else class="grid gap-4 xl:grid-cols-2">
            <Card
                    v-for="userItem in visibleUsers"
                    :key="userItem.getId()"
                    :class="getUserCardClasses(userItem)"
                    @click="openUser(userItem.getId())"
            >
                <CardContent class="flex items-start gap-4 p-5">
                    <div :class="getAvatarClasses(userItem)">
                        {{ getInitials(userItem) }}
                    </div>

                    <div class="min-w-0 flex-1 space-y-3">
                        <div class="space-y-1">
                            <div class="truncate text-lg font-semibold text-foreground">
                                {{ userItem.getFullName() }}
                            </div>
                            <div class="truncate text-sm text-muted-foreground">
                                {{ userItem.getDepartmentName() }}
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-2">
                            <Badge
                                    variant="secondary"
                                    class="gap-2 rounded-full px-3 py-1"
                            >
                                <Shield class="size-3.5"/>
                                {{ userItem.getRoleName() }}
                            </Badge>

                            <Badge
                                    v-if="isCurrentUser(userItem)"
                                    variant="outline"
                                    class="gap-2 rounded-full px-3 py-1"
                            >
                                <UserRound class="size-3.5"/>
                                Вы
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <BasePagination
                v-if="lastPage > 1"
                v-model="currentPage"
                :last-page="lastPage"
        />
    </div>
</template>