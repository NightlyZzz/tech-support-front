<script setup lang="ts">
    import { computed } from 'vue'
    import { SendHorizontal } from 'lucide-vue-next'
    import BaseButton from '@/components/base/BaseButton.vue'
    import { Input } from '@/components/ui/input'

    const message = defineModel<string>({
        required: true
    })

    const props = defineProps<{
        canWrite: boolean
    }>()

    const emit = defineEmits<{
        (event: 'submit'): void
    }>()

    const canSubmit = computed(() => {
        return props.canWrite && message.value.trim().length > 0
    })

    const handleSubmit = (): void => {
        if (!canSubmit.value) {
            return
        }

        emit('submit')
    }
</script>

<template>
    <form
            v-if="canWrite"
            class="flex flex-col gap-3 rounded-2xl border bg-background/80 p-3 sm:flex-row sm:items-center"
            @submit.prevent="handleSubmit"
    >
        <Input
                v-model="message"
                type="text"
                placeholder="Введите сообщение"
                class="h-11 flex-1"
        />

        <BaseButton
                type="submit"
                variant="primary"
                :disabled="!canSubmit"
        >
            <SendHorizontal class="size-4"/>
            Отправить
        </BaseButton>
    </form>

    <div
            v-else
            class="rounded-2xl border border-dashed bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
    >
        Переписка по этой заявке закрыта
    </div>
</template>