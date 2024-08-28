'use client';
import React from 'react';
import { useUpdateEvent } from "@/firebase/hooks/event";
import { useHapticsContext } from '@/providers/HapticsProvider';
import { EventUpdate, Event } from "@/app/interfaces";

interface UpdateEventProps {
    event: Event
    onComplete: () => void;
}

const UpdateEvent: React.FC<UpdateEventProps> = ({ event, onComplete }) => {

    const formatDateForInput = (date: Date | string | undefined): string => {
        if (!date) return '';
        if (typeof date === 'string') date = new Date(date);
        return date.toISOString().slice(0, 16);
    };

    const [updateEvent, setUpdateEvent] = React.useState<EventUpdate>({
        id: event.id,
        createBy: event.createBy,
        title: event.title,
        description: event.description,
        eventDate: formatDateForInput(event.eventDate),
        eventLocation: event.eventLocation,
        pickupDate: formatDateForInput(event.pickupDate),
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

        updateEvent.eventDate = new Date(updateEvent.eventDate);
        updateEvent.pickupDate = new Date(updateEvent.pickupDate);

        mutate(updateEvent as Event);

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
                        value={formatDateForInput(updateEvent.eventDate)}
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
                        value={formatDateForInput(updateEvent.pickupDate)}
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