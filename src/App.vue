<script setup lang="ts">
    import { computed } from 'vue'
    import NavBar from '@/components/NavBar.vue'
    import BaseToast from '@/components/BaseToast.vue'
    import { getUser } from '@/user/data'

    const isAuthenticated = computed(() => !!getUser())
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