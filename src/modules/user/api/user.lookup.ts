import { publicApi } from '@/shared/api/public.api'

export const getAllDepartments = async (): Promise<any> => {
    const response = await publicApi.get('/public/departments')
    return response.data
}

export const getAllRoles = async (): Promise<any> => {
    const response = await publicApi.get('/public/roles')
    return response.data
}