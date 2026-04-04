import { onMounted, reactive, ref } from 'vue'
import { createTicket } from '@/modules/ticket/api/ticket.api'
import { getAllTicketTypes } from '@/modules/ticket/api/ticket.lookup'
import { showToast } from '@/shared/toast/toastService'

interface TicketType {
    id: number
    name: string
}

interface CreateTicketResponse {
    message?: string
}

interface ApiError {
    response?: {
        data?: {
            message?: string
        }
    }
}

export const useCreateTicket = () => {
    const ticketTypes = ref<TicketType[]>([])
    const isSubmitting = ref(false)

    const form = reactive({
        ticketTypeId: 0 as number,
        description: '',
        contactPhone: ''
    })

    const loadTicketTypes = async (): Promise<void> => {
        try {
            const response = await getAllTicketTypes()
            ticketTypes.value = response.data ?? []
        } catch {
            showToast('Ошибка загрузки типов заявок', 'error')
        }
    }

    const submitTicket = async (): Promise<void> => {
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
            const response: CreateTicketResponse = await createTicket({
                ticket_type_id: form.ticketTypeId,
                description: form.description,
                contact_phone: formattedPhone
            })

            showToast(response.message || 'Заявка успешно отправлена!', 'success')

            form.ticketTypeId = 0
            form.description = ''
            form.contactPhone = ''
        } catch (error: unknown) {
            const apiError = error as ApiError
            showToast(apiError?.response?.data?.message || 'Ошибка при отправке заявки', 'error')
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