import type { EditableUserPayload, EditUserForm } from '@/modules/user/types/edit-user'

type EditUserComparableSnapshot = Omit<EditUserForm, 'new_password'>

export const buildEditUserSnapshot = (form: EditUserComparableSnapshot): string => {
    return JSON.stringify({
        first_name: form.first_name,
        last_name: form.last_name,
        middle_name: form.middle_name,
        email: form.email,
        secondary_email: form.secondary_email,
        department_id: form.department_id,
        role_id: form.role_id
    })
}

export const mapEditableUserPayloadToForm = (userData: EditableUserPayload): EditUserForm => {
    return {
        first_name: userData.first_name ?? '',
        last_name: userData.last_name ?? '',
        middle_name: userData.middle_name ?? '',
        email: userData.email ?? '',
        secondary_email: userData.secondary_email ?? '',
        new_password: '',
        department_id: userData.department_id ?? null,
        role_id: userData.role_id ?? null
    }
}