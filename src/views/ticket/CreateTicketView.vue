<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Создать заявку</h1>
    </div>

    <div style="max-width:600px;margin:0 auto;width:100%;">
      <div class="card">
        <p class="card-title">Информация о заявке</p>
        <div style="display:flex;flex-direction:column;gap:20px;">
          <Select
            id="ticket_type"
            label="Тип запроса"
            placeholder="Выберите тип запроса"
            v-model="form.ticket_type_id"
            :items="ticketTypes"
            label-key="name"
            value-key="id"
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
              @input="formatPhone"
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
              @input="autoResize"
              ref="descriptionRef"
            ></textarea>
            <span style="font-size:.75rem;color:var(--c-text-3);text-align:right;">
              {{ form.description.length }}/255
            </span>
          </div>
          <button :class="['btn', 'btn--primary', loading ? 'btn-loading' : '']" style="width:100%;" @click="submitTicket">
            Отправить заявку
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, nextTick } from 'vue'
import { getUser } from '@/user/data.ts'
import Select from '@/components/Select.vue'
import { createTicket, getAllTicketTypes } from '@/utils/requests.ts'
import { showToast } from '@/utils/toast'

interface TicketType {
  id: number;
  name: string
}

const token: string = getUser().getToken()
const ticketTypes: any = ref<TicketType[]>([])
const loading = ref(false)
const form: any = reactive({
  ticket_type_id: '',
  description: '',
  contact_phone: ''
})

const displayPhone = ref('')

const fetchTicketTypes = async (): Promise<void> => {
  try {
    const response: Response = await getAllTicketTypes(token)
    if (response.ok) ticketTypes.value = (await response.json()).data
  } catch (e) {
    console.error(e)
  }
}

const submitTicket = async (): Promise<void> => {
  if (!form.ticket_type_id || !form.description.trim() || !form.contact_phone) {
    showToast('Пожалуйста, заполните все поля', 'error')
    return
  }

  loading.value = true

  try {
    const response: Response = await createTicket(form, token)

    let result: any = {}

    try {
      result = await response.json()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      result = {}
    }

    if (response.ok) {
      showToast(result.message || 'Заявка успешно отправлена!', 'success')
      form.ticket_type_id = ''
      form.description = ''
      form.contact_phone = ''
    } else {
      showToast(result.message || 'Ошибка при отправке заявки', 'error')
    }

  } catch (e) {
    console.error(e)
    showToast('Ошибка сети или сервер недоступен', 'error')
  } finally {
    loading.value = false
  }
}

const formatPhone = (event: Event): void => {
  const input = event.target as HTMLInputElement

  let raw = input.value.replace(/\D/g, '')

  if (raw.startsWith('8')) raw = '7' + raw.slice(1)
  if (!raw.startsWith('7')) raw = '7' + raw

  raw = raw.slice(0, 11)

  form.contact_phone = '+' + raw

  let formatted = '+7'

  if (raw.length > 1) formatted += ' (' + raw.slice(1, 4)
  if (raw.length >= 4) formatted += ') ' + raw.slice(4, 7)
  if (raw.length >= 7) formatted += '-' + raw.slice(7, 9)
  if (raw.length >= 9) formatted += '-' + raw.slice(9, 11)

  displayPhone.value = formatted
}

const descriptionRef = ref<HTMLTextAreaElement | null>(null)

const autoResize = () => {
  const el = descriptionRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

onMounted(fetchTicketTypes)
</script>

<style scoped>
@import '@/assets/base.css';
@import '@/assets/list.css';
</style>
