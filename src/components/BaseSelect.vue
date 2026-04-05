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
        (event: 'update:modelValue', value: number | null): void
    }>()

    const onChange = (event: Event) => {
        const target = event.target as HTMLSelectElement

        if (target.value === '') {
            emit('update:modelValue', null)
            return
        }

        emit('update:modelValue', Number(target.value))
    }
</script>

<template>
    <div class="field">
        <label v-if="label" :for="id">{{ label }}</label>

        <select
                :id="id"
                :value="modelValue ?? ''"
                @change="onChange"
        >
            <option
                    v-if="placeholder"
                    disabled
                    value=""
            >
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

<style scoped>
    @import '@/assets/base.css';
</style>