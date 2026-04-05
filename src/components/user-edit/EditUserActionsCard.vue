<script setup lang="ts">
    defineEmits<{
        (event: 'save'): void
        (event: 'delete'): void
    }>()
</script>

<template>
    <div class="card">
        <p class="card-title">Действия</p>

        <div class="action-row">
            <button class="btn btn--primary" @click="$emit('save')">
                Сохранить изменения
            </button>

            <button class="btn btn--danger" @click="$emit('delete')">
                Удалить пользователя
            </button>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>