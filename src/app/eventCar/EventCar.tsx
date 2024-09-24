'use client';
import React, { useState, useEffect } from "react";
import { Event, EventCar, Participant, User } from '../interfaces';
import { useGetCar } from "@/firebase/hooks/car";
import { useGetUser, useGetCurrentUser } from "@/firebase/hooks/user";
import { useDeleteEventCar } from "@/firebase/hooks/eventCar";
import { useDeleteParticipantByEventCar } from "@/firebase/hooks/participant";
import { useHapticsContext } from "@/providers/HapticsProvider";
import ConfirmationButton from "@/components/ConfirmationButton";

interface EventCarProps {
    eventCar: EventCar;
    participants?: Participant[];
}

const EventCarItem: React.FC<EventCarProps> = ({ eventCar, participants }) => {

    const participantsNames = participants?.map((participant) => `${participant.firstName} ${participant.lastName}`)

    const { data: carData, isLoading: carLoading } = useGetCar(eventCar.carId);
    const [carOwner, setCarOwner] = useState<User | undefined>(undefined);
    const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

    const { mutate: deleteEventCar } = useDeleteEventCar();
    const { mutate: deleteEventCarParticipant } = useDeleteParticipantByEventCar();

    const { data: currentUserData, isLoading: isCurrentUserLoading } = useGetCurrentUser();
    const { data: userData } = useGetUser(eventCar.uid);

    const { snackbar } = useHapticsContext();

    useEffect(() => {
        if (carData && carData.success && userData && userData.success) {
            setCarOwner(userData.data);
        }
    }, [carData, userData]);

    useEffect(() => {
        if (currentUserData) {
            setCurrentUser(currentUserData.data);
        }
    }, [currentUserData, isCurrentUserLoading]);

    const driverName = carOwner ? `${carOwner.firstName} ${carOwner.lastName}` : "";
    const isOwner = currentUser && currentUser?.uid === carOwner?.uid;

    const seats: number = carData?.data ? carData?.data.seats : 0;
    const seatsRemaining: number = seats - (participants?.length ?? 0);


    const handleDelete = async () => {
        deleteEventCar(eventCar);
        deleteEventCarParticipant(eventCar.id);
        snackbar("Car removed successfully", "success");
    }

    const seatsText = seatsRemaining == seats ? seats + ` seat${seatsRemaining !== 1 ? "s" : ""}` : seatsRemaining + ` seat${seatsRemaining !== 1 ? "s" : ""} remaining`;
    

    return (
        <div className="item bg-violet-300">
            { driverName && 
                <div className="row">
                    <p>Driver: {driverName}</p>
                </div>
            }
            <div className="row">
                <p>Description: {carData?.data.description},</p>
                <p>{seatsText}</p>
            </div>

            {participantsNames && participantsNames.length > 0 && 
                <div className='list-container'>
                    <p className='list-header'>In the car:</p>
                    <ul> 
                        {participantsNames.map((name) => <li key={name}>• {name}</li>)}
                    </ul>
                </div>
            }

            {isOwner && <ConfirmationButton onClick={handleDelete}>Remove Car</ConfirmationButton>}

        </div>
    );
};

export default EventCarItem;