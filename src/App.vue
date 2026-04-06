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
    <div id="app">
        <NavBar v-if="isAuthenticated"/>

        <RouterView v-slot="{ Component }">
            <Transition name="page" mode="out-in">
                <component :is="Component" :key="pageTransitionKey"/>
            </Transition>
        </RouterView>

        <BaseToast/>
    </div>
</template>