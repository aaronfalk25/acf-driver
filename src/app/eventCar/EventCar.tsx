'use client';
import React, { useState, useEffect } from "react";
import { Event, EventCar, Participant, User } from '../interfaces';
import { useGetCar } from "@/firebase/hooks/car";
import { useUser } from "@/firebase/hooks/user";
import { useDeleteEventCar } from "@/firebase/hooks/eventCar";
import { useHapticsContext } from "@/providers/HapticsProvider";
import ConfirmationButton from "@/components/ConfirmationButton";

interface EventCarProps {
    eventCar: EventCar;
    event: Event;
    participants?: Participant[];
}

const EventCarItem: React.FC<EventCarProps> = ({ eventCar, event, participants }) => {

    const participantsNames = participants?.map((participant) => `${participant.firstName} ${participant.lastName}`)

    const { data: carData, isLoading: carLoading } = useGetCar(eventCar.carId);
    const [carOwner, setCarOwner] = useState<User | undefined>(undefined);
    const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

    const { mutate: deleteEventCar } = useDeleteEventCar();

    const { getUser, getCurrentUser } = useUser();
    const { snackbar } = useHapticsContext();

    useEffect(() => {
        if (carData && carData.success) {
            getUser(carData.data.uid).then((user) => {
                if (user) {
                    setCarOwner(user);
                }
            });

            getCurrentUser().then((user) => {
                if (user) {
                    setCurrentUser(user);
                }
            });
        }
    }, [carData]);

    const driverName = carOwner ? `${carOwner.firstName} ${carOwner.lastName}` : "";
    const isOwner = currentUser && currentUser?.uid === carOwner?.uid;
    
    const handleDelete = async () => {
        deleteEventCar(eventCar);
        snackbar("Car removed successfully", "success");
    }

    return (
        <div className="item">
            { driverName && <p>Driver: {driverName}</p> }
            <h2>{carData?.data.description}</h2>
            {participants && carData?.data ? carData?.data.seats ?? 0 - participants.length + " seats remaining" : carData?.data.seats + " seats"}

            {participantsNames && 
                <>
                    <p>In the car:</p>
                    <ul>
                        {participantsNames.map((name) => <li key={name}>{name}</li>)}
                    </ul>
                </>
            }

            {isOwner && <ConfirmationButton onClick={handleDelete}>Remove Car</ConfirmationButton>}

        </div>
    );
};

export default EventCarItem;