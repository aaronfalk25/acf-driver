'use client';
import React from 'react';
import { useCreateEvent } from "@/firebase/hooks/event";
import { EventCreate } from "@/app/interfaces";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEvent({
            ...event,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        mutate(event);
        onComplete();
    };

    return (
        <section>
            <h1>Create Event</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Title
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
                    Event Date
                    <input
                        type="datetime-local"
                        name="eventDate"
                        value={event.eventDate ? event.eventDate.toString() : ""}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Event Location
                    <input
                        type="text"
                        name="eventLocation"
                        value={event.eventLocation}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Pickup Date
                    <input
                        type="datetime-local"
                        name="pickupDate"
                        value={event.pickupDate ? event.pickupDate.toString() : ""}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Pickup Location
                    <input
                        type="text"
                        name="pickupLocation"
                        value={event.pickupLocation}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Event'}
                </button>
                {isError && <p>Error: {(error as any)?.message}</p>}
            </form>
        </section>
    );
}


export default CreateEvent;