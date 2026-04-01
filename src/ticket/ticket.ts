import { TicketStatus } from '@/enums/ticketStatus'

export class Ticket {
  constructor(
    public id: number,
    public description: string,
    public createdAt: string,
    public typeName: string,
    public statusName: string,
    public statusId: number,
    public senderName: string
  ) {
  }

  getId(): number {
    return this.id
  }

  getDescription(): string {
    return this.description
  }

  getCreatedAt(): string {
    return this.createdAt
  }

  getTypeName(): string {
    return this.typeName
  }

  getStatusName(): string {
    return this.statusName
  }

  getStatusId(): number {
    return this.statusId
  }

  getSenderName(): string {
    return this.senderName
  }

  isPending(): boolean {
    return this.statusId === TicketStatus.Pending
  }

  isReview(): boolean {
    return this.statusId === TicketStatus.Review
  }

  isResolved(): boolean {
    return this.statusId === TicketStatus.Resolved
  }

  canTake(): boolean {
    return this.isPending()
  }

  setReview(): void {
    this.statusId = TicketStatus.Review
    this.statusName = 'На рассмотрении'
  }
}
