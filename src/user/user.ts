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
        public secondaryEmail?: string
    ) {
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

    getSecondaryEmail(): string | undefined {
        return this.secondaryEmail
    }
}
