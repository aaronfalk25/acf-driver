'use client';
import React from 'react';
import { useCreateEvent } from "@/firebase/hooks/event";
import { EventCreate } from "@/app/interfaces";
import { useHapticsContext } from '@/providers/HapticsProvider';

interface CreateEventProps {
    uid: string;
    onComplete: () => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({ uid, onComplete }) => {

    const [event, setEvent] = React.useState<EventCreate>({
        createBy: uid,
        title: "",
        description: "",
        eventDate: null,
        eventLocation: "",
        pickupDate: null,
        pickupLocation: "",
    });

    const { mutate, isLoading, isError, error } = useCreateEvent();

    const { snackbar } = useHapticsContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!event.title || !event.eventDate || !event.eventLocation || !event.pickupDate || !event.pickupLocation) {
            snackbar("Please fill out all required fields", "error");
            return;
        }

        event.eventDate = new Date(event.eventDate);
        event.pickupDate = new Date(event.pickupDate);

        mutate(event);

        snackbar("Event created successfully", "success");
        onComplete();
    };

    return (
        <section>
            <h1>Create Event</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Title*
                    <input
                        type="text"
                        name="title"
                        value={event.title}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Description
                    <input
                        type="text"
                        name="description"
                        value={event.description}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Event Date*
                    <input
                        type="datetime-local"
                        name="eventDate"
                        value={event.eventDate ? event.eventDate.toString() : ""}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Event Location*
                    <input
                        type="text"
                        name="eventLocation"
                        value={event.eventLocation}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Pickup Date*
                    <input
                        type="datetime-local"
                        name="pickupDate"
                        value={event.pickupDate ? event.pickupDate.toString() : ""}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Pickup Location*
                    <input
                        type="text"
                        name="pickupLocation"
                        value={event.pickupLocation}
                        onChange={handleChange}
                    />
                </label>

                <p>*Required</p>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Event'}
                </button>
                {isError && <p>Error: {(error as any)?.message}</p>}
            </form>
        </section>
    );
}


export default CreateEvent;