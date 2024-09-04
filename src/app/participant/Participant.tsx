'use client';
import React, { useState, useMemo } from "react";
import { Participant, Car } from "../interfaces";
import { useUpdateParticipant, useDeleteParticipant } from "@/firebase/hooks/participant";
import { useDeleteEventCarById } from "@/firebase/hooks/eventCar";
import { useGetCarsByEvent } from "@/firebase/hooks/car";
import { useGetUsers } from "@/firebase/hooks/user";
import { useHapticsContext } from "@/providers/HapticsProvider";
import { isEmpty } from "../utils/common";
import ConfirmationButton from "@/components/ConfirmationButton";

interface ParticipantProps {
    participant: Participant;
    onComplete: () => void;
}


const ParticipantItem: React.FC<ParticipantProps> = ({ participant, onComplete }) => {

    const fullName = `${participant.firstName} ${participant.lastName}`;
    const contact = [participant.email, participant.phoneNumber].filter(Boolean).join(", ");
    const [selectedEventCarId, setSelectedEventCarId] = useState<string | undefined>(participant.eventCarId);

    const { mutate: updateParticipant } = useUpdateParticipant();
    const  { data: eventCarData, isLoading: eventCarLoading } = useGetCarsByEvent(participant.eventId);

    const driverUids = useMemo(() => {
        return eventCarData ? Object.entries(eventCarData).map(([eventCarId, car]: [string, Car]) => car.uid) : [];
      }, [eventCarData]);
      
      const { data: userData } = useGetUsers(driverUids);

    const { mutate: deleteParticipant } = useDeleteParticipant();
    const { mutate: deleteEventCar } = useDeleteEventCarById();

    const { snackbar } = useHapticsContext();

    const getCarName = (eventCarId: string) => {
        const car = eventCarData && eventCarData[eventCarId];
        const user = userData && userData[car?.uid || ""];

        if (car && user) {
            return `${car?.description} - ${user?.firstName} ${user?.lastName}`;
        }
        else if (car) {
            return car.description;
        }
        else {
            return "";
        }
        
    }

    const handleUpdateParticipant = (e: React.FormEvent) => {

        e.preventDefault();

        const updatedParticipant = { ...participant, eventCarId: selectedEventCarId };

        updateParticipant(updatedParticipant);

        snackbar("Ride updated successfully", "success");

        onComplete();
    }

    const handleDeleteParticipant = () => {
        deleteParticipant(participant);
        if (participant.eventCarId ) {
            deleteEventCar(participant.eventCarId);
        }
        snackbar("Participant deleted successfully", "success");
        onComplete();
    }

    return (
        <section>
            <div className='item w-full'>
                <p>Name: {fullName}</p>
                <p>Contact: {contact}</p>

                {eventCarData && !isEmpty(eventCarData) ? (
                <form onSubmit={handleUpdateParticipant} className='min-w-max'>
                    <select
                        value={selectedEventCarId}
                        onChange={(e) =>  setSelectedEventCarId(e.target.value)}
                    >
                        <option value=''>Select Car</option>
                        {eventCarData && Object.entries(eventCarData).map(([eventCarId, car]: [string, Car]) => (
                        <option key={eventCarId} value={eventCarId}>
                            {getCarName(eventCarId)}
                        </option>
                        ))}
                    </select>
                <button type="submit" disabled={selectedEventCarId === participant.eventCarId}>Choose Car</button>
                </form>
                ) : 
                <p>No cars available</p>
                }


                <ConfirmationButton
                    onClick={handleDeleteParticipant}
                    confirmationMessage={`Confirm - Delete ${fullName}?`}
                > Delete Participant 
                </ConfirmationButton>


            </div>
        </section>
    );
}

export default ParticipantItem;