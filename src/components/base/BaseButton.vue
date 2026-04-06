<script setup lang="ts">
    const props = withDefaults(defineProps<{
        type?: 'button' | 'submit' | 'reset'
        variant?: 'primary' | 'secondary' | 'danger'
        size?: 'md' | 'sm'
        fullWidth?: boolean
        loading?: boolean
        disabled?: boolean
    }>(), {
        type: 'button',
        variant: 'primary',
        size: 'md',
        fullWidth: false,
        loading: false,
        disabled: false
    })
</script>

<template>
    <button
            :type="props.type"
            :class="[
            'btn',
            `btn--${props.variant}`,
            props.size === 'sm' ? 'btn--sm' : '',
            props.fullWidth ? 'btn--full' : '',
            props.loading ? 'btn-loading' : ''
        ]"
            :disabled="props.disabled || props.loading"
    >
        <slot/>
    </button>
</template>