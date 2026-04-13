<script setup lang="ts">
    import { computed } from 'vue'
    import { useRoute } from 'vue-router'
    import NavBar from '@/components/NavBar.vue'
    import BaseToast from '@/components/base/BaseToast.vue'
    import { useUser } from '@/modules/user/composables/useUser'

    const route = useRoute()
    const { user } = useUser()

    const isAuthenticated = computed(() => user.value !== null)
    const pageTransitionKey = computed(() => route.fullPath)
</script>

<template>
    <div class="min-h-screen bg-background text-foreground">
        <NavBar v-if="isAuthenticated"/>

        <main :class="isAuthenticated ? 'pt-20' : ''">
            <RouterView v-slot="{ Component }">
                <Transition
                        enter-active-class="transition-all duration-200 ease-out"
                        enter-from-class="translate-y-2 opacity-0"
                        enter-to-class="translate-y-0 opacity-100"
                        leave-active-class="transition-all duration-150 ease-in"
                        leave-from-class="translate-y-0 opacity-100"
                        leave-to-class="-translate-y-1 opacity-0"
                        mode="out-in"
                >
                    <component :is="Component" :key="pageTransitionKey"/>
                </Transition>
            </RouterView>
        </main>

        <BaseToast/>
    </div>
</template>