<script setup lang="ts">
    import { Input } from '@/components/ui/input'

    withDefaults(defineProps<{
        id?: string
        label?: string
        modelValue: string
        type?: string
        placeholder?: string
        required?: boolean
        disabled?: boolean
        minlength?: number
        maxlength?: number
        autocomplete?: string
    }>(), {
        id: undefined,
        label: undefined,
        type: 'text',
        placeholder: undefined,
        required: false,
        disabled: false,
        minlength: undefined,
        maxlength: undefined,
        autocomplete: undefined
    })

    const emit = defineEmits<{
        (event: 'update:modelValue', value: string): void
    }>()

    const handleUpdateModelValue = (value: string | number): void => {
        emit('update:modelValue', String(value))
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

        <Input
                :id="id"
                :model-value="modelValue"
                :type="type"
                :placeholder="placeholder"
                :required="required"
                :disabled="disabled"
                :minlength="minlength"
                :maxlength="maxlength"
                :autocomplete="autocomplete"
                @update:model-value="handleUpdateModelValue"
        />
    </div>
</template>