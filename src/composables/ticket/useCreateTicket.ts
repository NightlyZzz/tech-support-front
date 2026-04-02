import { reactive, ref, onMounted } from 'vue'
import { createTicket, getAllTicketTypes } from '@/utils/requests'
import { showToast } from '@/utils/toast'

interface TicketType {
    id: number
    name: string
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
        } catch (error: any) {
            showToast(error?.response?.data?.message || 'Ошибка при отправке заявки', 'error')
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
