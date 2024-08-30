export interface Participant {
    id: string,
    eventId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    eventCarId?: string,
}

export interface ParticipantCreate {
    eventId: string,
    firstName: string,
    lastName: string,
    email?: string,
    phoneNumber?: string,
}