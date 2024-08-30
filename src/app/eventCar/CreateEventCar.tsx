'use client';
import React from "react";
import { EventCarCreate, Car } from "../interfaces";
import { useCreateEventCar, useDeleteEventCarByUserByEvent } from "@/firebase/hooks/eventCar";
import { useHapticsContext } from "@/providers/HapticsProvider";
import { useGetCarsByUser } from "@/firebase/hooks/car";

interface CreateEventCarProps {
    uid: string;
    eventId: string;
    onComplete: () => void;
}

const CreateEventCar: React.FC<CreateEventCarProps> = ({ uid, eventId, onComplete }) => {

    const [eventCar, setEventCar] = React.useState<EventCarCreate>({
        carId: "",
        eventId,
        uid,
    });

    const { mutateAsync: createEventCar, isLoading, isError, error } = useCreateEventCar();
    const { mutateAsync: deleteEventCar } = useDeleteEventCarByUserByEvent();

    const { snackbar } = useHapticsContext();

    const { data: carsData, isLoading: carsLoading } = useGetCarsByUser(uid);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEventCar({
            ...eventCar,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!eventCar.carId) {
            snackbar("Please fill out all required fields", "error");
            return;
        }

        await deleteEventCar({ uid, eventId });
        await createEventCar(eventCar);
        
        snackbar("Car added to event successfully", "success");

        onComplete();
    };

    return (
        <section>
            <h1>Add Car to Event</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Car*
                    <select
                        name="carId"
                        value={eventCar.carId}
                        onChange={handleChange}
                    >
                        <option value="">Select a car</option>
                        {carsData?.data.cars.map((car: Car) => (
                            <option key={car.id} value={car.id}>{car.description}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Add Car</button>
            </form>
        </section>
    );
};

export default CreateEventCar;