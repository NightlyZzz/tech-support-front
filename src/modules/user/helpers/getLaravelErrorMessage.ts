import type { LaravelError } from '@/modules/user/types/register'

type ErrorWithResponse = {
    response?: {
        data?: LaravelError
    }
}

export const getLaravelErrorMessage = (error: unknown): string | null => {
    const errorResponse = (error as ErrorWithResponse)?.response?.data

    if (!errorResponse) {
        return null
    }

    if (errorResponse.errors) {
        const firstErrorGroup = Object.values(errorResponse.errors)[0]

        if (firstErrorGroup?.length) {
            return firstErrorGroup[0]
        }
    }

    return errorResponse.message ?? null
}