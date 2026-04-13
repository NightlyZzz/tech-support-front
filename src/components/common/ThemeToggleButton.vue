<script setup lang="ts">
    import { computed } from 'vue'
    import { Moon, Sun } from 'lucide-vue-next'
    import { useColorMode } from '@vueuse/core'
    import { Button } from '@/components/ui/button'

    const colorMode = useColorMode({
        attribute: 'class',
        initialValue: 'light'
    })

    const isDark = computed(() => colorMode.value === 'dark')
    const buttonLabel = computed(() => isDark.value ? 'Включить светлую тему' : 'Включить тёмную тему')

    const toggleTheme = (): void => {
        colorMode.value = isDark.value ? 'light' : 'dark'
    }
</script>

<template>
    <Button
            variant="outline"
            size="icon"
            type="button"
            :aria-label="buttonLabel"
            :title="buttonLabel"
            @click="toggleTheme"
    >
        <Sun v-if="isDark" class="size-4"/>
        <Moon v-else class="size-4"/>
    </Button>
</template>