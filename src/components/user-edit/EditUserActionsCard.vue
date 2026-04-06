<script setup lang="ts">
    import BaseButton from '@/components/base/BaseButton.vue'

    defineEmits<{
        (event: 'save'): void
        (event: 'delete'): void
    }>()
</script>

<template>
    <div class="card">
        <p class="card-title">Действия</p>

        <div class="action-row">
            <BaseButton
                    variant="primary"
                    @click="$emit('save')"
            >
                Сохранить изменения
            </BaseButton>

            <BaseButton
                    variant="danger"
                    @click="$emit('delete')"
            >
                Удалить пользователя
            </BaseButton>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/profile.css';
</style>