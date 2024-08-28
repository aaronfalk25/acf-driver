'use client';
import React from 'react';
import { useUpdateEvent } from "@/firebase/hooks/event";
import { useHapticsContext } from '@/providers/HapticsProvider';
import { Event } from "@/app/interfaces";

interface UpdateEventProps {
    event: Event
    onComplete: () => void;
}

const UpdateEvent: React.FC<UpdateEventProps> = ({ event, onComplete }) => {

    const [updateEvent, setUpdateEvent] = React.useState<Event>({
        id: event.id,
        createBy: event.createBy,
        title: event.title,
        description: event.description,
        eventDate: event.eventDate,
        eventLocation: event.eventLocation,
        pickupDate: event.pickupDate,
        pickupLocation: event.pickupLocation,
    });

    const { mutate, isLoading, isError, error } = useUpdateEvent();

    const { snackbar } = useHapticsContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdateEvent({
            ...updateEvent,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!updateEvent.title || !updateEvent.eventDate || !updateEvent.eventLocation || !updateEvent.pickupDate || !updateEvent.pickupLocation) {
            snackbar("Please fill out all required fields", "error");
            return;
        }

        mutate(updateEvent);

        snackbar("Event updated successfully", "success");
        onComplete();
    };

    return (
        <section>
            <h1>Update Event</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Title*
                    <input
                        type="text"
                        name="title"
                        value={updateEvent.title}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Description
                    <input
                        type="text"
                        name="description"
                        value={updateEvent.description}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Event Date*
                    <input
                        type="datetime-local"
                        name="eventDate"
                        value={updateEvent.eventDate ? updateEvent.eventDate.toString() : ""}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Event Location*
                    <input
                        type="text"
                        name="eventLocation"
                        value={updateEvent.eventLocation}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Pickup Date*
                    <input
                        type="datetime-local"
                        name="pickupDate"
                        value={updateEvent.pickupDate ? updateEvent.pickupDate.toString() : ""}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Pickup Location*
                    <input
                        type="text"
                        name="pickupLocation"
                        value={updateEvent.pickupLocation}
                        onChange={handleChange}
                    />
                </label>

                <p>*Required</p>

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Event'}
                </button>
                {isError && <p>Error: {(error as any)?.message}</p>}
            </form>
        </section>
    );
}


export default UpdateEvent;