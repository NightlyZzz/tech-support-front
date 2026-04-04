<script setup lang="ts">
    import { computed } from 'vue'
    import NavBar from '@/components/NavBar.vue'
    import BaseToast from '@/components/BaseToast.vue'
    import { getUser } from '@/modules/user/model/userState'

    const userRef = getUser()

    const isAuthenticated = computed(() => !!userRef.value)
</script>

<template>
    <div id="app">
        <NavBar v-if="isAuthenticated"/>

        <RouterView v-slot="{ Component }">
            <Transition name="page" mode="out-in">
                <component :is="Component"/>
            </Transition>
        </RouterView>

        <BaseToast/>
    </div>
</template>