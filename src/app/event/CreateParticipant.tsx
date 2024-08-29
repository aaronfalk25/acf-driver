'use client'
import React from 'react';
import { useCreateParticipant } from '@/firebase/hooks/participant';
import { ParticipantCreate } from '@/app/interfaces';
import { useHapticsContext } from '@/providers/HapticsProvider';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface CreateParticipantProps {
    eventId: string;
    onComplete: () => void;
}

const CreateParticipant: React.FC<CreateParticipantProps> = ({ eventId, onComplete }) => {

    const [participant, setParticipant] = React.useState<ParticipantCreate>({
        eventId,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });

    const { mutate, isLoading, isError, error } = useCreateParticipant();

    const { snackbar } = useHapticsContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParticipant({
            ...participant,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!participant.firstName || !participant.lastName) {
            snackbar("Please fill out all required fields", "error");
            return;
        }

        if (!participant.email && !participant.phoneNumber) {
            snackbar("Please provide an email or phone number for contact", "error");
            return;
        }

        mutate(participant);

        snackbar("Added participant!", "success");
        onComplete();
    };

    return (
        <section>
            <h1>Ride Request Form</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name*
                    <input
                        type="text"
                        name="firstName"
                        value={participant.firstName}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Last Name*
                    <input
                        type="text"
                        name="lastName"
                        value={participant.lastName}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={participant.email}
                        onChange={handleChange}
                    />
                </label>
                <label>
                Phone Number
                <PhoneInput
                    country={'us'}
                    value={participant.phoneNumber}
                    onChange={(value, country, e, formattedValue) => 
                        handleChange({ target: { name: 'phoneNumber', value: formattedValue } } as any)
                      }
                    inputProps={{
                    name: 'phoneNumber',
                    }}
                />
                </label>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Request Pickup'}
                </button>
                {isError && <p>Error: {(error as any)?.message}</p>}
            </form>
        </section>
    );
};

export default CreateParticipant;