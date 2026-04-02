import api from '@/utils/api'
import publicApi from "@/utils/publicApi.ts";

export const login = async (data: any): Promise<any> => {
    const res = await api.post('/auth/login', data)
    return res.data
}

export const register = async (data: any): Promise<any> => {
    const res = await api.post('/auth/register', data)
    return res.data
}

export const getCurrentUser = async (): Promise<any> => {
    const res = await api.get('/user')
    return res.data
}

export const getAnotherUser = async (id: number): Promise<any> => {
    const res = await api.get('/user/' + id)
    return res.data
}

export const getAllUsers = async (): Promise<any> => {
    const res = await api.get('/user/all')
    return res.data
}

export const updateUser = async (data: any): Promise<any> => {
    const res = await api.put('/user', data)
    return res.data
}

export const updateAnotherUser = async (id: number, data: any): Promise<any> => {
    const res = await api.put('/user/' + id, data)
    return res.data
}

export const deleteCurrentUser = async (): Promise<any> => {
    const res = await api.delete('/user')
    return res.data
}

export const deleteAnotherUser = async (id: number): Promise<any> => {
    const res = await api.delete('/user/' + id)
    return res.data
}

export const getAllDepartments = async (): Promise<any> => {
    const res = await publicApi.get('/public/departments')
    return res.data
}

export const getAllRoles = async (): Promise<any> => {
    const res = await publicApi.get('/public/roles')
    return res.data
}

export const getTicket = async (id: number): Promise<any> => {
    const res = await api.get('/ticket/' + id)
    return res.data
}

export const getAllTickets = async (page = 1): Promise<any> => {
    const res = await api.get('/ticket/all?page=' + page)
    return res.data
}

export const getMyTickets = async (page = 1): Promise<any> => {
    const res = await api.get('/ticket/my?page=' + page)
    return res.data
}

export const getAllTicketTypes = async (): Promise<any> => {
    const res = await api.get('/ticket/type/all')
    return res.data
}

export const createTicket = async (data: any): Promise<any> => {
    const res = await api.post('/ticket', data)
    return res.data
}

export const updateTicket = async (id: number, data: any): Promise<any> => {
    const res = await api.put('/ticket/' + id, data)
    return res.data
}

export const getTicketLogs = async (ticketId: number): Promise<any> => {
    const res = await api.get('/ticket/log/' + ticketId)
    return res.data
}

export const attachTicketLog = async (ticketId: number, data: any): Promise<any> => {
    const res = await api.post('/ticket/log/' + ticketId, data)
    return res.data
}

export const getAllTicketStatuses = async (): Promise<any> => {
    const res = await api.get('/ticket/status/all')
    return res.data
}
