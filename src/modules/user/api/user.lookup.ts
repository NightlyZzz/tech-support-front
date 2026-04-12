import { publicApi } from '@/shared/api/public.api'
import type { Department } from '@/modules/user/types/department'
import type { EditUserRole } from '@/modules/user/types/edit-user'
import type { LookupResponse } from '@/shared/types/lookup'

export const getAllDepartments = async (): Promise<LookupResponse<Department>> => {
    const response = await publicApi.get<LookupResponse<Department>>('/public/departments')
    return response.data
}

export const getAllRoles = async (): Promise<LookupResponse<EditUserRole>> => {
    const response = await publicApi.get<LookupResponse<EditUserRole>>('/public/roles')
    return response.data
}