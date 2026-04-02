import { computed } from 'vue'

export const usePhoneInput = (form: any) => {
    const allowOnlyDigits = (event: KeyboardEvent): void => {
        const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete']

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
    }

    const displayPhone = computed(() => {
        const phone = form.contactPhone

        if (!phone) {
            return ''
        }

        const digits = phone.replace(/\D/g, '')

        let formatted = '+7'

        if (digits.length > 1) {
            formatted += ' (' + digits.slice(1, 4)
        }

        if (digits.length >= 4) {
            formatted += ') ' + digits.slice(4, 7)
        }

        if (digits.length >= 7) {
            formatted += '-' + digits.slice(7, 9)
        }

        if (digits.length >= 9) {
            formatted += '-' + digits.slice(9, 11)
        }

        return formatted
    })

    return {
        displayPhone,
        handlePhoneInput,
        allowOnlyDigits
    }
}