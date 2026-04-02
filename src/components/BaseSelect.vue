<template>
    <div class="field">
        <label v-if="label" :for="id">{{ label }}</label>

        <select
                :id="id"
                :value="modelValue ?? ''"
                @change="onChange"
        >
            <option disabled value="">
                {{ placeholder }}
            </option>

            <option
                    v-for="item in items"
                    :key="item[valueKey]"
                    :value="item[valueKey]"
            >
                {{ item[labelKey] }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
    interface SelectItem {
        [key: string]: any
    }

    const {
        id,
        label,
        placeholder,
        items,
        modelValue,
        valueKey,
        labelKey
    } = defineProps<{
        id?: string
        label?: string
        placeholder?: string
        items: SelectItem[]
        modelValue: number | null
        valueKey: string
        labelKey: string
    }>()

    const emit = defineEmits<{
        (e: 'update:modelValue', value: number): void
    }>()

    const onChange = (event: Event) => {
        const target = event.target as HTMLSelectElement
        const value = Number(target.value)

        emit('update:modelValue', value)
    }
</script>

<style scoped>
    @import '@/assets/base.css';
</style>
