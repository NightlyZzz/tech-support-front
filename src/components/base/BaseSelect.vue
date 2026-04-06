<script setup lang="ts">
    type SelectValue = number | null

    const props = withDefaults(defineProps<{
        id?: string
        label?: string
        placeholder?: string
        items: readonly unknown[]
        modelValue: SelectValue
        valueKey: string
        labelKey: string
    }>(), {
        id: undefined,
        label: undefined,
        placeholder: undefined
    })

    const emit = defineEmits<{
        (event: 'update:modelValue', value: SelectValue): void
    }>()

    const getItemRecord = (item: unknown): Record<string, unknown> => {
        if (typeof item === 'object' && item !== null) {
            return item as Record<string, unknown>
        }

        return {}
    }

    const getItemKey = (item: unknown, index: number): string | number => {
        const rawValue = getItemRecord(item)[props.valueKey]

        if (typeof rawValue === 'string' || typeof rawValue === 'number') {
            return rawValue
        }

        return index
    }

    const getItemValue = (item: unknown): string => {
        const rawValue = getItemRecord(item)[props.valueKey]

        if (typeof rawValue === 'number') {
            return String(rawValue)
        }

        if (typeof rawValue === 'string') {
            return rawValue
        }

        return ''
    }

    const getItemLabel = (item: unknown): string => {
        const rawLabel = getItemRecord(item)[props.labelKey]

        if (typeof rawLabel === 'string' || typeof rawLabel === 'number') {
            return String(rawLabel)
        }

        return ''
    }

    const onChange = (event: Event): void => {
        const target = event.target as HTMLSelectElement
        const nextValue = target.value

        if (nextValue === '') {
            emit('update:modelValue', null)
            return
        }

        const parsedValue = Number(nextValue)

        emit('update:modelValue', Number.isNaN(parsedValue) ? null : parsedValue)
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
                    v-for="(item, index) in items"
                    :key="getItemKey(item, index)"
                    :value="getItemValue(item)"
            >
                {{ getItemLabel(item) }}
            </option>
        </select>
    </div>
</template>