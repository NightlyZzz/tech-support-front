import type { UserData } from '@/modules/user/types/user'

export class User {
    constructor(
            private id: number,
            private email: string,
            private firstName: string,
            private lastName: string,
            private middleName: string,
            private role: number,
            private roleName: string,
            private department: number,
            private departmentName: string,
            private secondaryEmail: string | null,
            private requiresGoogleCompletion: boolean
    ) {
    }

    static fromApi(data: Partial<UserData>): User {
        return new User(
                Number(data.id ?? 0),
                data.email ?? '',
                data.first_name ?? '',
                data.last_name ?? '',
                data.middle_name ?? '',
                Number(data.role_id ?? 0),
                data.role_name ?? '',
                Number(data.department_id ?? 0),
                data.department_name ?? '',
                data.secondary_email ?? null,
                Boolean(data.requires_google_registration_completion)
        )
    }

    toStorage(): UserData {
        return {
            id: this.id,
            email: this.email,
            first_name: this.firstName,
            last_name: this.lastName,
            middle_name: this.middleName,
            secondary_email: this.secondaryEmail,
            role_id: this.role,
            role_name: this.roleName,
            department_id: this.department > 0 ? this.department : null,
            department_name: this.departmentName,
            requires_google_registration_completion: this.requiresGoogleCompletion
        }
    }

    getId(): number {
        return this.id
    }

    getEmail(): string {
        return this.email
    }

    getFirstName(): string {
        return this.firstName
    }

    getLastName(): string {
        return this.lastName
    }

    getMiddleName(): string {
        return this.middleName
    }

    getRole(): number {
        return this.role
    }

    getRoleName(): string {
        return this.roleName
    }

    getDepartment(): number {
        return this.department
    }

    getDepartmentName(): string {
        return this.departmentName
    }

    getSecondaryEmail(): string | null {
        return this.secondaryEmail
    }

    getRequiresGoogleRegistrationCompletion(): boolean {
        return this.requiresGoogleCompletion
    }

    getFullName(): string {
        return [this.lastName, this.firstName, this.middleName].filter(Boolean).join(' ').trim()
    }

    getInitials(): string {
        const lastNameFirstLetter = this.lastName[0] ?? ''
        const firstNameFirstLetter = this.firstName[0] ?? ''

        return `${lastNameFirstLetter}${firstNameFirstLetter}`
    }
}