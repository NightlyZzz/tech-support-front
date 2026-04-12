export interface LoginForm {
    email: string
    password: string
    remember: boolean
}

export interface LoginRequest {
    email: string
    password: string
    remember: boolean
}

export interface AuthActionResponse {
    message: string
}