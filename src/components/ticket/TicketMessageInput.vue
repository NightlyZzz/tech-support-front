<script setup lang="ts">
    const message = defineModel<string>({
        required: true
    })

    defineProps<{
        canWrite: boolean
    }>()

    const emit = defineEmits<{
        (e: 'submit'): void
    }>()
</script>

<template>
    <form
            v-if="canWrite"
            class="ticket-input-area"
            @submit.prevent="emit('submit')"
    >
        <input
                v-model="message"
                type="text"
                placeholder="Введите сообщение…"
                class="ticket-input"
        />

        <button
                type="submit"
                class="btn btn--primary"
                :disabled="!message.trim() || !canWrite"
        >
            Отправить
        </button>
    </form>

    <div v-else class="ticket-closed">
        Переписка по этой заявке закрыта
    </div>
</template>