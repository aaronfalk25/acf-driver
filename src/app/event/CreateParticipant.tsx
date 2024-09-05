'use client'
import React, { useState } from 'react';
import { useCreateParticipant } from '@/firebase/hooks/participant';
import { useGetCarsByEvent } from '@/firebase/hooks/car';
import { ParticipantCreate, Participant } from '@/app/interfaces';
import { useHapticsContext } from '@/providers/HapticsProvider';
import SelectEventCarForm from '../participant/SelectEventCarForm';
import Modal from '@/components/Modal';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface CreateParticipantProps {
    eventId: string;
    onComplete: () => void;
}

const CreateParticipant: React.FC<CreateParticipantProps> = ({ eventId, onComplete }) => {

    const [participant, setParticipant] = useState<ParticipantCreate>({
        eventId,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });

    const [participantResponse, setParticipantResponse] = useState<Participant | null>(null);

    const [showSelectEventCarFormModal, setShowSelectEventCarFormModal] = useState(false);

    const { mutateAsync: createParticipant, isLoading, isError, error } = useCreateParticipant();

    const { data: eventCarData } = useGetCarsByEvent(eventId);

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

        const res = await createParticipant(participant);
        setParticipantResponse(res.data);

        snackbar("Added participant!", "success");
 
        if (Object.keys(eventCarData ?? {}).length > 0) {
            setShowSelectEventCarFormModal(true);
        }
        else {
            onComplete();
        }
    };

    const carSelectOnComplete = () => {
        setShowSelectEventCarFormModal(false);
        onComplete();
    }

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

            {showSelectEventCarFormModal && participantResponse && 
            <Modal
                onClose={() => setShowSelectEventCarFormModal(false)}
            >
                <h2>Select a Car</h2>
                <SelectEventCarForm
                    participant={participantResponse}
                    onComplete={carSelectOnComplete}
                />
            </Modal>
            }
                        
        </section>
    );
};

export default CreateParticipant;