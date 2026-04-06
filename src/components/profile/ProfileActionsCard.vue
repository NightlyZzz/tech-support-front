<script setup lang="ts">
    import BaseButton from '@/components/base/BaseButton.vue'

    defineProps<{
        loading: boolean
    }>()

    defineEmits<{
        (event: 'save'): void
        (event: 'logout'): void
        (event: 'delete'): void
    }>()
</script>

<template>
    <div class="card">
        <p class="card-title">Действия</p>

        <div class="action-row">
            <BaseButton
                    variant="primary"
                    :loading="loading"
                    @click="$emit('save')"
            >
                Сохранить изменения
            </BaseButton>

            <BaseButton
                    variant="secondary"
                    @click="$emit('logout')"
            >
                Выйти
            </BaseButton>

            <BaseButton
                    variant="danger"
                    @click="$emit('delete')"
            >
                Удалить аккаунт
            </BaseButton>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/profile.css';
</style>