<template>
    <div class="page">
        <div class="page-header">
            <h1 class="page-title">Создать заявку</h1>
        </div>

        <div style="max-width:600px;margin:0 auto;width:100%;">
            <div class="card">
                <p class="card-title">Информация о заявке</p>

                <div style="display:flex;flex-direction:column;gap:20px;">
                    <BaseSelect
                            id="ticket_type"
                            label="Тип запроса"
                            placeholder="Выберите тип запроса"
                            v-model="form.ticketTypeId"
                            :items="ticketTypes"
                            labelKey="name"
                            valueKey="id"
                    />

                    <div class="field">
                        <label for="contact_phone">Контактный телефон</label>
                        <input
                                :key="phoneKey"
                                :value="displayPhone"
                                id="contact_phone"
                                type="tel"
                                inputmode="numeric"
                                maxlength="18"
                                placeholder="+7 (___) ___-__-__"
                                @input="handlePhoneInput"
                                @keydown="allowOnlyDigits"
                        />
                    </div>

                    <div class="field">
                        <label for="description">Краткое описание проблемы</label>
                        <textarea
                                v-model="form.description"
                                id="description"
                                maxlength="255"
                                rows="3"
                                placeholder="Опишите вашу проблему…"
                        ></textarea>

                        <span style="font-size:.75rem;color:var(--c-text-3);text-align:right;">
              {{ form.description.length }}/255
            </span>
                    </div>

                    <button
                            :class="['btn', 'btn--primary', isSubmitting ? 'btn-loading' : '']"
                            style="width:100%;"
                            @click="handleSubmit"
                    >
                        Отправить заявку
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import BaseSelect from '@/components/BaseSelect.vue'
    import { useCreateTicket } from '@/composables/ticket/useCreateTicket'
    import { usePhoneInput } from '@/composables/common/usePhoneInput'

    const { form, ticketTypes, isSubmitting, submitTicket } = useCreateTicket()

    const { displayPhone, handlePhoneInput, allowOnlyDigits } = usePhoneInput(form)

    const phoneKey = ref(0)

    const handleSubmit = async () => {
        await submitTicket()
        phoneKey.value++
    }
</script>

<style scoped>
    @import '@/assets/base.css';
    @import '@/assets/list.css';
</style>