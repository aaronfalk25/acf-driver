export interface User {
    uid: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    is_admin: boolean;
}

export interface UserCreate {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    is_admin: boolean;
}