'use client';
import React from "react";
import { Car, CarCreate } from "../interfaces";
import { useCreateCar } from "@/firebase/hooks/car";
import { useHapticsContext } from "@/providers/HapticsProvider";

interface CreateCarProps {
    uid: string;
    onComplete: () => void;
}

const CreateCar: React.FC<CreateCarProps> = ({ uid, onComplete }) => {

    const [car, setCar] = React.useState<CarCreate>({
        description: "",
        seats: 0,
        uid,
    });

    const { mutate, isLoading, isError, error } = useCreateCar();

    const { snackbar } = useHapticsContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCar({
            ...car,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!car.description) {
            snackbar("Please fill out all required fields", "error");
            return;
        }

        mutate(car);

        snackbar("Car added successfully", "success");

        onComplete();
    };

    return (
        <section>
            <h1>Create Car</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Description*
                    <input
                        type="text"
                        name="description"
                        value={car.description}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Seats*
                    <p>Note: Do NOT include yourself as the driver. So if you have 5 spots, subtract 1 for yourself as the driver.</p>
                    <input
                        type="number"
                        name="seats"
                        value={car.seats}
                        min={0}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Addings...' : 'Add Car'}
                </button>
                {isError && <p>Error: {(error as any)?.message}</p>}
            </form>
        </section>
    );
}

export default CreateCar;