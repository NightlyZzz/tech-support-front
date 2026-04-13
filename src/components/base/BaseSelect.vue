<script setup lang="ts">
    import type { AcceptableValue } from 'reka-ui'
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue
    } from '@/components/ui/select'

    type SelectValueType = number | null

    const props = withDefaults(defineProps<{
        id?: string
        label?: string
        placeholder?: string
        items: readonly unknown[]
        modelValue: SelectValueType
        valueKey: string
        labelKey: string
    }>(), {
        id: undefined,
        label: undefined,
        placeholder: undefined
    })

    const emit = defineEmits<{
        (event: 'update:modelValue', value: SelectValueType): void
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

    const onUpdateValue = (value: AcceptableValue): void => {
        if (value === '' || value === null || value === undefined) {
            emit('update:modelValue', null)
            return
        }

        const parsedValue = Number(String(value))

        emit('update:modelValue', Number.isNaN(parsedValue) ? null : parsedValue)
    }
</script>

<template>
    <div class="flex flex-col gap-2">
        <label
                v-if="label"
                :for="id"
                class="text-sm font-medium text-foreground"
        >
            {{ label }}
        </label>

        <Select
                :model-value="modelValue === null ? '' : String(modelValue)"
                @update:model-value="onUpdateValue"
        >
            <SelectTrigger :id="id" class="w-full">
                <SelectValue :placeholder="placeholder || 'Выберите значение'"/>
            </SelectTrigger>

            <SelectContent>
                <SelectItem
                        v-for="(item, index) in items"
                        :key="getItemKey(item, index)"
                        :value="getItemValue(item)"
                >
                    {{ getItemLabel(item) }}
                </SelectItem>
            </SelectContent>
        </Select>
    </div>
</template>