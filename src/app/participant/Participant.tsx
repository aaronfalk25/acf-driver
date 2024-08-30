'use client';
import React, { useEffect, useState } from "react";
import { EventCar, Participant, Car } from "../interfaces";
import { useUpdateParticipant } from "@/firebase/hooks/participant";
import { useGetCarsByEvent } from "@/firebase/hooks/car";
import { useHapticsContext } from "@/providers/HapticsProvider";
import { useGetEventCar } from "@/firebase/hooks/eventCar";
import { isEmpty } from "../utils/common";

interface ParticipantProps {
    participant: Participant;
}


const ParticipantItem: React.FC<ParticipantProps> = ({ participant }) => {

    const fullName = `${participant.firstName} ${participant.lastName}`;
    const contact = [participant.email, participant.phoneNumber].filter(Boolean).join(", ");
    const [selectedEventCarId, setSelectedEventCarId] = useState<string | undefined>(participant.eventCarId);

    const { mutate: updateParticipant } = useUpdateParticipant();
    const  { data: eventCarData, isLoading: eventCarLoading } = useGetCarsByEvent(participant.eventId);

    const { snackbar } = useHapticsContext();

    const handleUpdateParticipant = (e: React.FormEvent) => {

        e.preventDefault();

        const updatedParticipant = { ...participant, eventCarId: selectedEventCarId };

        updateParticipant(updatedParticipant);

        snackbar("Ride updated successfully", "success");
    }

    return (
        <section>
            <h1>Participant</h1>
            <div className='item'>
                <p>Name: {fullName}</p>
                <p>Contact: {contact}</p>

                {eventCarData && !isEmpty(eventCarData) ? (
                <form onSubmit={handleUpdateParticipant}>
                    <label>
                        Event Car
                        <select
                            value={selectedEventCarId}
                            onChange={(e) =>  setSelectedEventCarId(e.target.value)}
                        >
                            <option value=''>Select Car</option>
                            {eventCarData && Object.entries(eventCarData).map(([eventCarId, car]: [string, Car]) => (
                            <option key={eventCarId} value={eventCarId}>
                                {car.description}
                            </option>
                            ))}
                        </select>
                    </label>
                <button type="submit" disabled={selectedEventCarId === participant.eventCarId}>Choose Car</button>
                </form>
                ) : 
                <p>No cars available</p>
                }

            </div>
        </section>
    );
}

export default ParticipantItem;