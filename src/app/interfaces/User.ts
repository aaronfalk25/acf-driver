export interface User {
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
}

export interface UserCreate {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
}