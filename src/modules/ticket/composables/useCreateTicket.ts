import { onMounted, reactive, ref } from 'vue'
import { createTicket } from '@/modules/ticket/api/ticket.api'
import { getAllTicketTypes } from '@/modules/ticket/api/ticket.lookup'
import { showToast } from '@/shared/toast/toastService'
import type { TicketTypeOption } from '@/modules/ticket/types/ticket'

type CreateTicketForm = {
    ticketTypeId: number
    description: string
    contactPhone: string
}

type ApiErrorResponse = {
    response?: {
        data?: {
            message?: string
        }
    }
}

export const useCreateTicket = () => {
    const ticketTypes = ref<TicketTypeOption[]>([])
    const isSubmitting = ref(false)

    const form = reactive<CreateTicketForm>({
        ticketTypeId: 0,
        description: '',
        contactPhone: ''
    })

    const loadTicketTypes = async (): Promise<void> => {
        try {
            const response = await getAllTicketTypes()
            ticketTypes.value = response.data ?? []
        } catch {
            ticketTypes.value = []
            showToast('Ошибка загрузки типов заявок', 'error')
        }
    }

    const submitTicket = async (): Promise<void> => {
        if (isSubmitting.value) {
            return
        }

        let normalizedPhoneDigits = form.contactPhone.replace(/\D/g, '')

        if (normalizedPhoneDigits.startsWith('8')) {
            normalizedPhoneDigits = '7' + normalizedPhoneDigits.slice(1)
        }

        if (!normalizedPhoneDigits.startsWith('7')) {
            normalizedPhoneDigits = '7' + normalizedPhoneDigits
        }

        normalizedPhoneDigits = normalizedPhoneDigits.slice(0, 11)

        if (!form.ticketTypeId || !form.description.trim() || normalizedPhoneDigits.length < 11) {
            showToast('Пожалуйста, заполните все поля корректно', 'error')
            return
        }

        const formattedPhone = '+' + normalizedPhoneDigits

        isSubmitting.value = true

        try {
            const response = await createTicket({
                ticket_type_id: form.ticketTypeId,
                description: form.description.trim(),
                contact_phone: formattedPhone
            })

            showToast(response.message || 'Заявка успешно отправлена!', 'success')

            form.ticketTypeId = 0
            form.description = ''
            form.contactPhone = ''
        } catch (error: unknown) {
            const apiError = error as ApiErrorResponse
            showToast(apiError.response?.data?.message || 'Ошибка при отправке заявки', 'error')
        } finally {
            isSubmitting.value = false
        }
    }

    onMounted(loadTicketTypes)

    return {
        form,
        ticketTypes,
        isSubmitting,
        submitTicket
    }
}