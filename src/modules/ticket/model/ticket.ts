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
            private senderName: string,
            private employeeName: string | null
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

    getEmployeeName(): string | null {
        return this.employeeName
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

    getCreatedAtFormatted(): string {
        if (!this.createdAt) {
            return '—'
        }

        const normalizedCreatedAt = this.createdAt.replace(
                /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\.\d+Z$/,
                '$1Z'
        )

        const parsedDate = new Date(normalizedCreatedAt)

        if (Number.isNaN(parsedDate.getTime())) {
            return this.createdAt
        }

        return parsedDate.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    getSenderName(): string {
        return this.senderName
    }

    canTake(): boolean {
        return this.statusId === 1
    }

    setReview(employeeId: number, employeeName: string | null = null): void {
        this.employeeId = employeeId
        this.employeeName = employeeName
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