<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="['toast', `toast--${toast.type}`]"
        >
          <svg v-if="toast.type === 'success'" width="16" height="16" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          <svg v-else-if="toast.type === 'error'" width="16" height="16" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <svg v-else width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"
               stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z"/>
          </svg>
          <span>{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { toasts } from '@/utils/toast'
</script>

<style scoped>
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
    width: auto;
    max-width: 380px;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-radius: 10px;
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 500;
    box-shadow: var(--sh-lg);
    pointer-events: auto;
    min-width: 260px;
    max-width: 380px;
  }

  .toast--success svg {
    color: var(--c-success);
    flex-shrink: 0;
  }

  .toast--error svg {
    color: var(--c-danger);
    flex-shrink: 0;
  }

  .toast--info svg {
    color: var(--c-accent);
    flex-shrink: 0;
  }

  .toast-enter-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .toast-leave-active {
    transition: all 0.25s ease;
  }

  .toast-enter-from {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translateX(40px);
  }
</style>
