import { computed } from 'vue'

type PhoneForm = {
    contactPhone: string
}

const normalizePhone = (value: string): string => {
    let normalizedDigits = value.replace(/\D/g, '')

    if (!normalizedDigits) {
        return ''
    }

    if (normalizedDigits.startsWith('8')) {
        normalizedDigits = '7' + normalizedDigits.slice(1)
    }

    if (!normalizedDigits.startsWith('7')) {
        normalizedDigits = '7' + normalizedDigits
    }

    normalizedDigits = normalizedDigits.slice(0, 11)

    return '+' + normalizedDigits
}

const formatPhone = (value: string): string => {
    const normalizedDigits = value.replace(/\D/g, '')

    if (!normalizedDigits) {
        return ''
    }

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
}

export const usePhoneInput = <TForm extends PhoneForm>(form: TForm) => {
    const allowOnlyDigits = (event: KeyboardEvent): void => {
        const allowedKeys = [
            'Backspace',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'Tab',
            'Delete',
            'Home',
            'End'
        ]

        if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
            return
        }

        if (!/[0-9]/.test(event.key)) {
            event.preventDefault()
        }
    }

    const handlePhoneInput = (event: Event): void => {
        const inputElement = event.target as HTMLInputElement
        form.contactPhone = normalizePhone(inputElement.value)
    }

    const displayPhone = computed(() => {
        return formatPhone(form.contactPhone)
    })

    return {
        displayPhone,
        handlePhoneInput,
        allowOnlyDigits
    }
}