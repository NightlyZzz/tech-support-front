<script setup lang="ts">
    import { removeToast } from '@/shared/toast/toastService'
    import { toasts } from '@/shared/toast/toastStore'
</script>

<template>
    <Teleport to="body">
        <div class="toast-container">
            <TransitionGroup name="toast">
                <div
                        v-for="toast in toasts"
                        :key="toast.id"
                        :class="['toast', `toast--${toast.type}`]"
                >
                    <span class="toast-icon">
                        <svg v-if="toast.type === 'success'" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7"/>
                        </svg>

                        <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12"/>
                        </svg>

                        <svg v-else viewBox="0 0 24 24">
                            <path d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z"/>
                        </svg>
                    </span>

                    <span>{{ toast.message }}</span>

                    <button
                            type="button"
                            class="toast-close"
                            aria-label="Закрыть уведомление"
                            @click="removeToast(toast.id)"
                    >
                        ×
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>