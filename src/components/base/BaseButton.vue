<script setup lang="ts">
    import { computed } from 'vue'
    import { LoaderCircle } from 'lucide-vue-next'
    import { Button } from '@/components/ui/button'

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

    const mappedVariant = computed(() => {
        if (props.variant === 'secondary') {
            return 'outline'
        }

        if (props.variant === 'danger') {
            return 'destructive'
        }

        return 'default'
    })

    const mappedSize = computed(() => {
        return props.size === 'sm' ? 'sm' : 'default'
    })
</script>

<template>
    <Button
            :type="props.type"
            :variant="mappedVariant"
            :size="mappedSize"
            :disabled="props.disabled || props.loading"
            :class="props.fullWidth ? 'w-full' : ''"
    >
        <LoaderCircle v-if="props.loading" class="size-4 animate-spin"/>
        <slot/>
    </Button>
</template>