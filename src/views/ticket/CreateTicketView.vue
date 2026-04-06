<script setup lang="ts">
    import { ref } from 'vue'
    import BaseButton from '@/components/base/BaseButton.vue'
    import BaseSelect from '@/components/base/BaseSelect.vue'
    import BaseTextarea from '@/components/base/BaseTextarea.vue'
    import { useCreateTicket } from '@/modules/ticket/composables/useCreateTicket'
    import { usePhoneInput } from '@/composables/common/usePhoneInput'

    const { form, ticketTypes, isSubmitting, submitTicket } = useCreateTicket()
    const { displayPhone, handlePhoneInput, allowOnlyDigits } = usePhoneInput(form)

    const phoneInputKey = ref(0)

    const handleSubmit = async (): Promise<void> => {
        await submitTicket()
        phoneInputKey.value += 1
    }
</script>

<template>
    <div class="page">
        <div class="page-header">
            <h1 class="page-title">Создать заявку</h1>
        </div>

        <div class="create-ticket-container">
            <div class="card">
                <p class="card-title">Информация о заявке</p>

                <div class="create-ticket-stack">
                    <BaseSelect
                            id="ticket_type"
                            v-model="form.ticketTypeId"
                            label="Тип запроса"
                            placeholder="Выберите тип запроса"
                            :items="ticketTypes"
                            label-key="name"
                            value-key="id"
                    />

                    <div class="field">
                        <label for="contact_phone">Контактный телефон</label>
                        <input
                                :key="phoneInputKey"
                                id="contact_phone"
                                :value="displayPhone"
                                type="tel"
                                inputmode="numeric"
                                maxlength="18"
                                placeholder="+7 (___) ___-__-__"
                                @input="handlePhoneInput"
                                @keydown="allowOnlyDigits"
                        >
                    </div>

                    <BaseTextarea
                            id="description"
                            v-model="form.description"
                            label="Краткое описание проблемы"
                            placeholder="Опишите вашу проблему…"
                            :rows="3"
                            :maxlength="255"
                    />

                    <span class="create-ticket-counter">
                        {{ form.description.length }}/255
                    </span>

                    <BaseButton
                            variant="primary"
                            :full-width="true"
                            :loading="isSubmitting"
                            :disabled="isSubmitting"
                            @click="handleSubmit"
                    >
                        Отправить заявку
                    </BaseButton>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';

    .create-ticket-container {
        max-width: 600px;
        margin: 0 auto;
        width: 100%;
    }

    .create-ticket-stack {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .create-ticket-counter {
        font-size: .75rem;
        color: var(--c-text-3);
        text-align: right;
    }
</style>