import type { UserData, UserUpdatePayload } from '@/modules/user/types/user'
import type { Department } from '@/modules/user/types/department'

type UserFormFields = {
    first_name: string
    last_name: string
    middle_name: string
    email: string
    secondary_email: string
    new_password: string
    department_id: number | null
}

export const buildUserUpdatePayload = <TForm extends UserFormFields>(
        form: TForm,
        originalForm?: Partial<TForm>,
        options?: {
            includeRoleId?: number | null
            compareWithOriginal?: boolean
        }
): UserUpdatePayload => {
    const updatePayload: UserUpdatePayload = {}
    const compareWithOriginal = options?.compareWithOriginal ?? false

    const nextFirstName = form.first_name.trim()
    const nextLastName = form.last_name.trim()
    const nextMiddleName = form.middle_name.trim()
    const nextEmail = form.email.trim()
    const nextSecondaryEmail = form.secondary_email.trim()

    const previousFirstName = originalForm?.first_name?.trim() ?? ''
    const previousLastName = originalForm?.last_name?.trim() ?? ''
    const previousMiddleName = originalForm?.middle_name?.trim() ?? ''
    const previousEmail = originalForm?.email?.trim() ?? ''
    const previousSecondaryEmail = originalForm?.secondary_email?.trim() ?? ''
    const previousDepartmentId = originalForm?.department_id ?? null

    if (!compareWithOriginal || nextFirstName !== previousFirstName) {
        updatePayload.first_name = nextFirstName
    }

    if (!compareWithOriginal || nextLastName !== previousLastName) {
        updatePayload.last_name = nextLastName
    }

    if (!compareWithOriginal || nextMiddleName !== previousMiddleName) {
        updatePayload.middle_name = nextMiddleName
    }

    if (!compareWithOriginal || nextEmail !== previousEmail) {
        updatePayload.email = nextEmail
    }

    if (!compareWithOriginal || nextSecondaryEmail !== previousSecondaryEmail) {
        updatePayload.secondary_email = nextSecondaryEmail === '' ? null : nextSecondaryEmail
    }

    if (form.department_id !== null && (!compareWithOriginal || form.department_id !== previousDepartmentId)) {
        updatePayload.department_id = form.department_id
    }

    const trimmedPassword = form.new_password.trim()

    if (trimmedPassword.length >= 8) {
        updatePayload.new_password = trimmedPassword
    }

    if (options?.includeRoleId !== undefined) {
        updatePayload.role_id = options.includeRoleId
    }

    return updatePayload
}

export const buildUpdatedUserData = (
        currentUser: UserData,
        form: UserFormFields,
        departments: Department[]
): UserData => {
    const selectedDepartmentName =
            departments.find((departmentItem) => departmentItem.id === form.department_id)?.name ??
            currentUser.department_name

    const normalizedSecondaryEmail = form.secondary_email.trim()

    return {
        id: currentUser.id,
        email: form.email.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        middle_name: form.middle_name.trim(),
        role_id: currentUser.role_id,
        role_name: currentUser.role_name,
        department_id: form.department_id ?? currentUser.department_id,
        department_name: selectedDepartmentName,
        secondary_email: normalizedSecondaryEmail === '' ? null : normalizedSecondaryEmail,
        requires_google_registration_completion: currentUser.requires_google_registration_completion
    }
}