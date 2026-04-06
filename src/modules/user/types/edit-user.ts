export interface EditUserDepartment {
    id: number
    name: string
}

export interface EditUserRole {
    id: number
    name: string
}

export interface EditUserForm {
    first_name: string
    last_name: string
    middle_name: string
    email: string
    secondary_email: string
    new_password: string
    department_id: number | null
    role_id: number | null
}

export interface EditableUserPayload {
    first_name?: string
    last_name?: string
    middle_name?: string
    email?: string
    secondary_email?: string | null
    department_id?: number | null
    role_id?: number | null
}

export interface EditableUserResponse {
    data: EditableUserPayload
}