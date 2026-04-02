<template>
    <div id="app">
        <NavBar v-if="getNavbarState()"/>
        <RouterView v-slot="{ Component }">
            <Transition name="page" mode="out-in">
                <component :is="Component" :key="$route.fullPath"/>
            </Transition>
        </RouterView>
        <BaseToast/>
    </div>
</template>

<script setup lang="ts">
    import NavBar from '@/components/NavBar.vue'
    import { getNavbarState } from '@/user/data.ts'
    import BaseToast from "@/components/BaseToast.vue";
</script>