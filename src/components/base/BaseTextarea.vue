<script setup lang="ts">
    import { Textarea } from '@/components/ui/textarea'

    const props = withDefaults(defineProps<{
        id?: string
        label?: string
        modelValue: string
        placeholder?: string
        rows?: number
        maxlength?: number
        required?: boolean
        disabled?: boolean
        textareaClass?: string
    }>(), {
        id: undefined,
        label: undefined,
        placeholder: undefined,
        rows: 3,
        maxlength: undefined,
        required: false,
        disabled: false,
        textareaClass: ''
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

        <Textarea
                :id="id"
                :model-value="modelValue"
                :placeholder="placeholder"
                :rows="rows"
                :maxlength="maxlength"
                :required="required"
                :disabled="disabled"
                :class="props.textareaClass"
                @update:model-value="handleUpdateModelValue"
        />
    </div>
</template>