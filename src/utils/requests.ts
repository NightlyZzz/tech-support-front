import { BACKEND_URL } from '@/utils/constants'

export const login = async (data: any): Promise<Response> => {
  return fetch(BACKEND_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const register = async (data: any): Promise<Response> => {
  return fetch(BACKEND_URL + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const getCurrentUser = async (token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}

export const getAnotherUser = async (id: number, token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/user/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}

export const getAllUsers = async (token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/user/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}

export const updateUser = async (data: any, token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data)
  })
}

export const updateAnotherUser = async (id: number, data: any, token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/user/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data)
  })
}

export const deleteCurrentUser = async (token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/user', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}

export const deleteAnotherUser = async (id: number, token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/user/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}

export const getAllDepartments = async (): Promise<Response> => {
  return fetch(BACKEND_URL + '/department/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
}

export const getAllRoles = async (): Promise<Response> => {
  return fetch(BACKEND_URL + '/role/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getTicket = async (id: number, token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/ticket/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}

export const getAllTickets = async (token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/ticket/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}

export const getAllTicketTypes = async (token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/ticket/type/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}

export const getMyTickets = async (token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/ticket/my', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}

export const createTicket = async (data: any, token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/ticket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data)
  })
}

export const updateTicket = async (id: number, data: any, token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/ticket/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data)
  })
}

export const getTicketLogs = async (ticketId: number, token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/ticket/log/' + ticketId, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  })
}

export const attachTicketLog = async (ticketId: number, data: any, token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/ticket/log/' + ticketId, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const getAllTicketStatuses = async (token: string): Promise<Response> => {
  return fetch(BACKEND_URL + '/ticket/status/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
}
