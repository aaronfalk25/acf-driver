'use client';
import React from "react";
import { Car } from "../interfaces";
import { useUpdateCar } from "@/firebase/hooks/car";
import { useHapticsContext } from "@/providers/HapticsProvider";

interface UpdateCarProps {
    car: Car;
    onComplete: () => void;
}

const UpdateCar: React.FC<UpdateCarProps> = ({ car, onComplete }) => {
    
        const [updatedCar, setUpdatedCar] = React.useState<Car>({
            ...car,
        });
    
        const { mutate, isLoading, isError, error } = useUpdateCar();
    
        const { snackbar } = useHapticsContext();
    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setUpdatedCar({
                ...updatedCar,
                [e.target.name]: e.target.value,
            });
        };
    
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
    
            if (!updatedCar.description || !updatedCar.seats) {
                snackbar("Please fill out all required fields", "error");
                return;
            }
    
            mutate(updatedCar);
    
            snackbar("Car updated successfully", "success");
    
            onComplete();
        };
    
        return (
            <section>
                <h1>Update Car</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Description*
                        <input
                            type="text"
                            name="description"
                            value={updatedCar.description}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Seats*
                        <input
                            type="number"
                            name="seats"
                            min={0}
                            value={updatedCar.seats}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Save Changes'}
                    {isError && <p>Error: {(error as any)?.message}</p>}
                </button>
                </form>
            </section>
        );
    }

export default UpdateCar;