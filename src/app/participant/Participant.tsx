'use client';
import React from "react";
import { Participant, Car, Event } from "../interfaces";
import { useDeleteParticipant } from "@/firebase/hooks/participant";
import { useGetCarsByEvent } from "@/firebase/hooks/car";
import { useHapticsContext } from "@/providers/HapticsProvider";
import { isEmpty } from "../utils/common";
import ConfirmationButton from "@/components/ConfirmationButton";
import SelectEventCarForm from "./SelectEventCarForm";

interface ParticipantProps {
    participant: Participant;
    onComplete: () => void;
    event?: Event;
}


const ParticipantItem: React.FC<ParticipantProps> = ({ participant, onComplete }) => {

    const fullName = `${participant.firstName} ${participant.lastName}`;
    const contact = [participant.email, participant.phoneNumber].filter(Boolean).join(", ");
    const  { data: eventCarData, isLoading: eventCarLoading } = useGetCarsByEvent(participant.eventId);

    const { mutate: deleteParticipant } = useDeleteParticipant();

    const { snackbar } = useHapticsContext();

    const handleDeleteParticipant = () => {
        deleteParticipant(participant);
        snackbar("Participant deleted successfully", "success");
        onComplete();
    }


    return (
        <section>
            <div className='item w-full'>
                <p>Name: {fullName}</p>
                <p>Contact: {contact}</p>

                {eventCarData && !isEmpty(eventCarData) ? (

                <SelectEventCarForm
                    participant={participant}
                />
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