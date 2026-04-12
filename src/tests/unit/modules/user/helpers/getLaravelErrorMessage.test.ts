import { describe, expect, it } from 'vitest'
import { getLaravelErrorMessage } from '@/modules/user/helpers/getLaravelErrorMessage'

describe('getLaravelErrorMessage', () => {
    it('returns first validation error message', () => {
        const error = {
            response: {
                data: {
                    message: 'Validation failed',
                    errors: {
                        email: ['Email is invalid'],
                        password: ['Password is too short']
                    }
                }
            }
        }

        expect(getLaravelErrorMessage(error)).toBe('Email is invalid')
    })

    it('returns common message when validation errors are absent', () => {
        const error = {
            response: {
                data: {
                    message: 'Request failed'
                }
            }
        }

        expect(getLaravelErrorMessage(error)).toBe('Request failed')
    })

    it('returns null when response data is absent', () => {
        expect(getLaravelErrorMessage(new Error('Network error'))).toBeNull()
    })
})