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

        let normalizedDigits = inputElement.value.replace(/\D/g, '')

        if (!normalizedDigits) {
            form.contactPhone = ''
            return
        }

        if (normalizedDigits.startsWith('8')) {
            normalizedDigits = '7' + normalizedDigits.slice(1)
        }

        if (!normalizedDigits.startsWith('7')) {
            normalizedDigits = '7' + normalizedDigits
        }

        normalizedDigits = normalizedDigits.slice(0, 11)

        form.contactPhone = '+' + normalizedDigits
    }

    const displayPhone = computed(() => {
        const rawPhone = form.contactPhone

        if (!rawPhone) {
            return ''
        }

        const normalizedDigits = rawPhone.replace(/\D/g, '')

        let formattedPhone = '+7'

        if (normalizedDigits.length > 1) {
            formattedPhone += ' (' + normalizedDigits.slice(1, 4)
        }

        if (normalizedDigits.length >= 4) {
            formattedPhone += ') ' + normalizedDigits.slice(4, 7)
        }

        if (normalizedDigits.length >= 7) {
            formattedPhone += '-' + normalizedDigits.slice(7, 9)
        }

        if (normalizedDigits.length >= 9) {
            formattedPhone += '-' + normalizedDigits.slice(9, 11)
        }

        return formattedPhone
    })

    return {
        displayPhone,
        handlePhoneInput,
        allowOnlyDigits
    }
}