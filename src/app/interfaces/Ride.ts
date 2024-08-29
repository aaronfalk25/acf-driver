export interface Ride {
    id: string,
    carId: string,
    eventId: string,
    participantId: string,
}

export interface RideCreate {
    carId: string,
    eventId: string,
    participantId: string,
}