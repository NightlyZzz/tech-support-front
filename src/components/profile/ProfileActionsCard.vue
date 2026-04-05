<script setup lang="ts">
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
            <button
                    :class="['btn', 'btn--primary', loading ? 'btn-loading' : '']"
                    @click="$emit('save')"
            >
                Сохранить изменения
            </button>

            <button class="btn btn--secondary" @click="$emit('logout')">
                Выйти
            </button>

            <button class="btn btn--danger" @click="$emit('delete')">
                Удалить аккаунт
            </button>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>