<script setup lang="ts">
    withDefaults(defineProps<{
        id?: string
        label?: string
        modelValue: string
        placeholder?: string
        rows?: number
        maxlength?: number
        required?: boolean
        disabled?: boolean
    }>(), {
        id: undefined,
        label: undefined,
        placeholder: undefined,
        rows: 3,
        maxlength: undefined,
        required: false,
        disabled: false
    })

    const emit = defineEmits<{
        (event: 'update:modelValue', value: string): void
    }>()

    const handleInput = (event: Event): void => {
        const target = event.target as HTMLTextAreaElement
        emit('update:modelValue', target.value)
    }
</script>

<template>
    <div class="field">
        <label v-if="label" :for="id">{{ label }}</label>

        <textarea
                :id="id"
                :value="modelValue"
                :placeholder="placeholder"
                :rows="rows"
                :maxlength="maxlength"
                :required="required"
                :disabled="disabled"
                @input="handleInput"
        ></textarea>
    </div>
</template>