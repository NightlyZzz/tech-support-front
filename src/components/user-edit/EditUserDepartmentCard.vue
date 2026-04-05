<script setup lang="ts">
    import BaseSelect from '@/components/BaseSelect.vue'
    import type { EditUserDepartment } from '@/modules/user/types/edit-user'

    defineProps<{
        departmentId: number | null
        departments: EditUserDepartment[]
    }>()

    const emit = defineEmits<{
        (event: 'update:departmentId', value: number | null): void
    }>()
</script>

<template>
    <div class="card">
        <p class="card-title">Подразделение</p>

        <BaseSelect
                :model-value="departmentId"
                :items="departments"
                label-key="name"
                value-key="id"
                @update:model-value="emit('update:departmentId', $event)"
        />
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>