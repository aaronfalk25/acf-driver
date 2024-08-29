'use client';
import React from "react";
import { Participant } from "../interfaces";

interface ParticipantProps {
    participant: Participant;
}


const ParticipantItem: React.FC<ParticipantProps> = ({ participant }) => {

    const fullName = `${participant.firstName} ${participant.lastName}`;
    const contact = [participant.email, participant.phoneNumber].filter(Boolean).join(", ");

    return (
        <section>
            <h1>Participant</h1>
            <div className='item'>
                <p>Name: {fullName}</p>
                <p>Contact: {contact}</p>
            </div>
        </section>
    );
}

export default ParticipantItem;