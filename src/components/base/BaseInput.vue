<script setup lang="ts">
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

    const handleInput = (event: Event): void => {
        const target = event.target as HTMLInputElement
        emit('update:modelValue', target.value)
    }
</script>

<template>
    <div class="field">
        <label v-if="label" :for="id">{{ label }}</label>

        <input
                :id="id"
                :value="modelValue"
                :type="type"
                :placeholder="placeholder"
                :required="required"
                :disabled="disabled"
                :minlength="minlength"
                :maxlength="maxlength"
                :autocomplete="autocomplete"
                @input="handleInput"
        >
    </div>
</template>