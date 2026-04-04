export class Ticket {
    constructor(
            private id: number,
            private description: string,
            private contactPhone: string,
            private senderId: number,
            private employeeId: number | null,
            private typeId: number,
            private typeName: string,
            private statusId: number,
            private statusName: string,
            private createdAt: string,
            private senderName: string
    ) {
    }

    getId(): number {
        return this.id
    }

    getDescription(): string {
        return this.description
    }

    getContactPhone(): string {
        return this.contactPhone
    }

    getSenderId(): number {
        return this.senderId
    }

    getEmployeeId(): number | null {
        return this.employeeId
    }

    getTypeId(): number {
        return this.typeId
    }

    getTypeName(): string {
        return this.typeName
    }

    getStatusId(): number {
        return this.statusId
    }

    getStatusName(): string {
        return this.statusName
    }

    getCreatedAt(): string {
        return this.createdAt
    }

    getSenderName(): string {
        return this.senderName
    }

    canTake(): boolean {
        return this.statusId === 1
    }

    setReview(employeeId: number): void {
        this.employeeId = employeeId
        this.statusId = 2
        this.statusName = 'На рассмотрении'
    }

    setStatus(statusId: number, statusName?: string): void {
        this.statusId = statusId

        if (statusName) {
            this.statusName = statusName
        }
    }
}