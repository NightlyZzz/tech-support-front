<script setup lang="ts">
    import { CheckCircle2, CircleAlert, Info, X } from 'lucide-vue-next'
    import { removeToast } from '@/shared/toast/toastService'
    import { toasts } from '@/shared/toast/toastStore'
    import { cn } from '@/lib/utils'
</script>

<template>
    <Teleport to="body">
        <div class="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
            <TransitionGroup
                    enter-active-class="transition-all duration-200 ease-out"
                    enter-from-class="translate-y-2 opacity-0"
                    enter-to-class="translate-y-0 opacity-100"
                    leave-active-class="transition-all duration-150 ease-in"
                    leave-from-class="translate-y-0 opacity-100"
                    leave-to-class="translate-y-2 opacity-0"
            >
                <div
                        v-for="toast in toasts"
                        :key="toast.id"
                        :class="cn(
                        'pointer-events-auto flex items-start gap-3 rounded-xl border bg-card px-4 py-3 text-sm shadow-lg',
                        toast.type === 'success' && 'border-emerald-500/20',
                        toast.type === 'error' && 'border-destructive/30',
                        toast.type === 'info' && 'border-border'
                    )"
                >
                    <div class="mt-0.5 shrink-0">
                        <CheckCircle2
                                v-if="toast.type === 'success'"
                                class="size-5 text-emerald-500"
                        />
                        <CircleAlert
                                v-else-if="toast.type === 'error'"
                                class="size-5 text-destructive"
                        />
                        <Info
                                v-else
                                class="size-5 text-primary"
                        />
                    </div>

                    <div class="min-w-0 flex-1 text-foreground">
                        {{ toast.message }}
                    </div>

                    <button
                            type="button"
                            class="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            aria-label="Закрыть уведомление"
                            @click="removeToast(toast.id)"
                    >
                        <X class="size-4"/>
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>