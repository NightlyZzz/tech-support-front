<script setup lang="ts">
    import BaseSelect from '@/components/base/BaseSelect.vue'
    import type { EditUserRole } from '@/modules/user/types/edit-user'

    defineProps<{
        roleId: number | null
        roles: EditUserRole[]
    }>()

    const emit = defineEmits<{
        (event: 'update:roleId', value: number | null): void
    }>()
</script>

<template>
    <div class="card">
        <p class="card-title">Роль</p>

        <BaseSelect
                :model-value="roleId"
                :items="roles"
                label-key="name"
                value-key="id"
                @update:model-value="emit('update:roleId', $event)"
        />
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/profile.css';
</style>