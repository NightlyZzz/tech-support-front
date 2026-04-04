export class User {
    constructor(
            public token: string,
            public id: number,
            public email: string,
            public firstName: string,
            public lastName: string,
            public middleName: string,
            public role: number,
            public roleName: string,
            public department: number,
            public departmentName: string,
            public secondaryEmail?: string | null
    ) {
    }

    static fromApi(data: any, fallbackToken = ''): User {
        return new User(
                data.token ?? fallbackToken,
                data.id,
                data.email,
                data.first_name ?? data.firstName ?? '',
                data.last_name ?? data.lastName ?? '',
                data.middle_name ?? data.middleName ?? '',
                data.role_id ?? data.role ?? 0,
                data.role_name ?? data.roleName ?? '',
                data.department_id ?? data.department ?? 0,
                data.department_name ?? data.departmentName ?? '',
                data.secondary_email ?? data.secondaryEmail ?? null
        )
    }

    getToken(): string {
        return this.token
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

    getSecondaryEmail(): string | null | undefined {
        return this.secondaryEmail
    }
}