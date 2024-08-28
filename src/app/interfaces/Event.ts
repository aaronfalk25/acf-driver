export interface Event {
    id: string,
    createBy: string, // FK to User
    title: string,
    description: string,
    eventDate: Date,
    eventLocation: string,
    pickupDate: Date,
    pickupLocation: string,
}

export interface EventCreate {
    createBy: string,
    title: string,
    description: string,
    eventDate: Date | null,
    eventLocation: string,
    pickupDate: Date | null,
    pickupLocation: string,
}