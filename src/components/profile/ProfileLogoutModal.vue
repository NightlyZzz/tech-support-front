<script setup lang="ts">
    defineProps<{
        open: boolean
        loading: boolean
    }>()

    defineEmits<{
        (event: 'close'): void
        (event: 'logoutCurrent'): void
        (event: 'logoutAll'): void
    }>()
</script>

<template>
    <div
            v-if="open"
            class="modal-overlay"
            @click.self="$emit('close')"
    >
        <div class="modal-card">
            <h3 class="modal-title">Выход из аккаунта</h3>

            <p class="modal-text">
                Хотите выйти только на текущем устройстве или на всех устройствах?
            </p>

            <div class="modal-actions">
                <button
                        type="button"
                        class="btn btn--primary btn--full"
                        :disabled="loading"
                        @click="$emit('logoutCurrent')"
                >
                    Выйти только на этом устройстве
                </button>

                <button
                        type="button"
                        class="btn btn--primary btn--full"
                        :disabled="loading"
                        @click="$emit('logoutAll')"
                >
                    Выйти на всех устройствах
                </button>

                <button
                        type="button"
                        class="btn btn--full"
                        :disabled="loading"
                        @click="$emit('close')"
                >
                    Отмена
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>