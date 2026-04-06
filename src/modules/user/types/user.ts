import type { PaginationMeta } from '@/types/common'

export interface UserData {
    id: number
    email: string
    first_name: string
    last_name: string
    middle_name: string
    secondary_email: string | null
    role_id: number
    role_name: string
    department_id: number
    department_name: string
    token?: string
}

export interface CurrentUserResponse {
    data: UserData
}

export interface UserResponse {
    data: UserData
}

export interface UsersListResponse {
    data: UserData[]
    meta: PaginationMeta
}

export interface UserActionResponse {
    message?: string
}

export interface UserUpdatePayload {
    first_name?: string
    last_name?: string
    middle_name?: string
    email?: string
    secondary_email?: string | null
    department_id?: number | null
    role_id?: number | null
    new_password?: string
}