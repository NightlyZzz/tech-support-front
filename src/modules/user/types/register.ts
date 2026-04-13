export interface RegisterForm {
    first_name: string
    last_name: string
    middle_name: string
    email: string
    password: string
    department_id: number | null
    remember: boolean
}

export interface RegisterRequest {
    first_name: string
    last_name: string
    middle_name: string
    email: string
    password: string
    department_id: number
    remember: boolean
}

export interface GoogleRegistrationCompletionRequest {
    department_id: number
    password: string
}

export interface LaravelError {
    message: string
    errors?: Record<string, string[]>
}