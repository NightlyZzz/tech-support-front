export const useTicketMessages = (currentUser: any) => {
  const isOwnMessage = (message: any): boolean => {
    return (
      message.sender_id === currentUser.getId() ||
      message.employee_id === currentUser.getId()
    )
  }

  const getDisplayName = (message: any): string => {
    if (isOwnMessage(message)) {
      return 'Вы'
    }

    if (message.sender_id !== null) {
      return message.sender_name
    }

    if (message.employee_id !== null) {
      return 'Сотрудник #' + message.employee_id
    }

    return 'Удалённый пользователь'
  }

  return {
    isOwnMessage,
    getDisplayName
  }
}
