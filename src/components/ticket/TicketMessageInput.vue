<script setup lang="ts">
    import { computed } from 'vue'
    import BaseButton from '@/components/base/BaseButton.vue'

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
            class="ticket-input-area"
            @submit.prevent="handleSubmit"
    >
        <input
                v-model="message"
                type="text"
                placeholder="Введите сообщение…"
                class="ticket-input"
        >

        <BaseButton
                type="submit"
                variant="primary"
                :disabled="!canSubmit"
        >
            Отправить
        </BaseButton>
    </form>

    <div v-else class="ticket-closed">
        Переписка по этой заявке закрыта
    </div>
</template>