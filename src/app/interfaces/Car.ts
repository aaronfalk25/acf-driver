export interface Car {
    id: string,
    description: string,
    seats: number,
    uid: string, // FK to User
}

export interface CarCreate {
    description: string,
    seats: number,
    uid: string,
}