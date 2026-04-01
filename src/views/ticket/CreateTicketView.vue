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
              @input="resizeTextarea"
              ref="descriptionElement"
            ></textarea>

            <span style="font-size:.75rem;color:var(--c-text-3);text-align:right;">
              {{ form.description.length }}/255
            </span>
          </div>

          <button
            :class="['btn', 'btn--primary', isSubmitting ? 'btn-loading' : '']"
            style="width:100%;"
            @click="submitTicket"
          >
            Отправить заявку
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import BaseSelect from '@/components/BaseSelect.vue'
import { createTicket, getAllTicketTypes } from '@/utils/requests'
import { showToast } from '@/utils/toast'

interface TicketType {
  id: number
  name: string
}

const ticketTypes = ref<TicketType[]>([])
const isSubmitting = ref(false)

const form = reactive({
  ticketTypeId: 0 as number,
  description: '',
  contactPhone: ''
})

const displayPhone = ref('')

const allowOnlyDigits = (event: KeyboardEvent): void => {
  const allowedKeys = [
    'Backspace',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
    'Delete'
  ]

  if (allowedKeys.includes(event.key)) {
    return
  }

  if (!/[0-9]/.test(event.key)) {
    event.preventDefault()
  }
}

const handlePhoneInput = (event: Event): void => {
  const inputElement = event.target as HTMLInputElement

  let digits = inputElement.value.replace(/\D/g, '')

  if (!digits) {
    form.contactPhone = ''
    displayPhone.value = ''
    return
  }

  if (digits.startsWith('8')) {
    digits = '7' + digits.slice(1)
  }

  if (!digits.startsWith('7')) {
    digits = '7' + digits
  }

  digits = digits.slice(0, 11)

  form.contactPhone = '+' + digits

  let formattedPhone = '+7'

  if (digits.length > 1) {
    formattedPhone += ' (' + digits.slice(1, 4)
  }

  if (digits.length >= 4) {
    formattedPhone += ') ' + digits.slice(4, 7)
  }

  if (digits.length >= 7) {
    formattedPhone += '-' + digits.slice(7, 9)
  }

  if (digits.length >= 9) {
    formattedPhone += '-' + digits.slice(9, 11)
  }

  displayPhone.value = formattedPhone
}

const descriptionElement = ref<HTMLTextAreaElement | null>(null)

const resizeTextarea = (): void => {
  if (!descriptionElement.value) {
    return
  }

  descriptionElement.value.style.height = 'auto'
  descriptionElement.value.style.height = descriptionElement.value.scrollHeight + 'px'
}

const loadTicketTypes = async (): Promise<void> => {
  try {
    const response = await getAllTicketTypes()
    ticketTypes.value = response.data ?? []
  } catch {
    showToast('Ошибка загрузки типов заявок', 'error')
  }
}

const submitTicket = async (): Promise<void> => {
  if (!form.ticketTypeId || !form.description.trim() || !form.contactPhone) {
    showToast('Пожалуйста, заполните все поля', 'error')
    return
  }

  isSubmitting.value = true

  try {
    const response = await createTicket({
      ticket_type_id: form.ticketTypeId,
      description: form.description,
      contact_phone: form.contactPhone
    })

    showToast(response.message || 'Заявка успешно отправлена!', 'success')

    form.ticketTypeId = 0
    form.description = ''
    form.contactPhone = ''
    displayPhone.value = ''
  } catch (error: any) {
    showToast(error?.response?.data?.message || 'Ошибка при отправке заявки', 'error')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(loadTicketTypes)
</script>

<style scoped>
@import '@/assets/base.css';
@import '@/assets/list.css';
</style>
