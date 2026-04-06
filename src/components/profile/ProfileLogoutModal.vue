<script setup lang="ts">
    import BaseButton from '@/components/base/BaseButton.vue'

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
                <BaseButton
                        type="button"
                        variant="primary"
                        :full-width="true"
                        :disabled="loading"
                        @click="$emit('logoutCurrent')"
                >
                    Выйти только на этом устройстве
                </BaseButton>

                <BaseButton
                        type="button"
                        variant="primary"
                        :full-width="true"
                        :disabled="loading"
                        @click="$emit('logoutAll')"
                >
                    Выйти на всех устройствах
                </BaseButton>

                <BaseButton
                        type="button"
                        variant="secondary"
                        :full-width="true"
                        :disabled="loading"
                        @click="$emit('close')"
                >
                    Отмена
                </BaseButton>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/profile.css';
</style>