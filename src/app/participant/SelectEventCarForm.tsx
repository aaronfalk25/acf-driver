'use client';
import React, { useState, useMemo } from 'react';
import { Car, Participant } from '@/app/interfaces';
import { useGetParticipantsByEvent, useUpdateParticipant } from '@/firebase/hooks/participant';
import { useGetCarsByEvent } from '@/firebase/hooks/car';
import { useGetUsers } from '@/firebase/hooks/user';
import { useHapticsContext } from '@/providers/HapticsProvider';

interface SelectEventCarFormProps {
    participant: Participant;
    onComplete?: () => void;
}

const SelectEventCarForm: React.FC<SelectEventCarFormProps> = ({ participant, onComplete }) => {
    const [selectedEventCarId, setSelectedEventCarId] = useState<string | undefined>(participant.eventCarId);

    const { data: participants } = useGetParticipantsByEvent(participant.eventId);
    const { data: eventCarData } = useGetCarsByEvent(participant.eventId);
    const { mutate: updateParticipant } = useUpdateParticipant();

    console.log(eventCarData);

    const driverUids = useMemo(() => {
        return eventCarData ? Object.entries(eventCarData).map(([eventCarId, car]: [string, Car]) => car.uid) : [];
      }, [eventCarData]);
      
    const { data: userData } = useGetUsers(driverUids)

    const { snackbar } = useHapticsContext();

    const seatsAreAvailable = () => {
        const totalParticipantsInCar = (participants?.data.participants?.filter((participant: Participant) => participant.eventCarId && participant.eventCarId !== ""))?.length || 0;
        const carSeats = (eventCarData && Object.values(eventCarData).reduce((acc, car) => Number(acc) + Number(car.seats), 0)) ?? 0;
        return totalParticipantsInCar < carSeats;
    }

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

        if (onComplete) {
            onComplete();
        }

        snackbar("Ride updated successfully", "success");
    }

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value !== "") {
            const car = eventCarData && eventCarData[e.target.value];
            const carSeats = car?.seats || 0;

            const eventCarParticipantCount = (participants?.data.participants?.filter((p: Participant) => p.eventCarId === e.target.value) || []).length;

            if (eventCarParticipantCount + 1 > carSeats && !(participant.eventCarId === e.target.value)) {
                snackbar("This car is already full. Please select a different option.", "error");
                return;
            }
        }

        setSelectedEventCarId(e.target.value);
    }

    if (!seatsAreAvailable()) {
        if (onComplete) {
            onComplete();
        }
    }

    return(
        <form onSubmit={handleUpdateParticipant} className='min-w-max'>
            <select
                value={selectedEventCarId}
                onChange={handleSelectionChange}
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
    )
}

export default SelectEventCarForm;