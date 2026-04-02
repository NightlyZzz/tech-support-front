<template>
  <div id="app">
    <NavBar v-if="getNavbarState()"/>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="$route.fullPath"/>
      </Transition>
    </RouterView>
    <Toast/>
  </div>
</template>

<script setup lang="ts">
  import NavBar from '@/components/NavBar.vue'
  import Toast from '@/components/Toast.vue'
  import { getNavbarState } from '@/user/data.ts'
</script>

<style>
  .page-enter-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
  }

  .page-leave-active {
    transition: opacity 0.12s ease;
  }

  .page-enter-from {
    opacity: 0;
    transform: translateY(6px);
  }

  .page-leave-to {
    opacity: 0;
  }
</style>
