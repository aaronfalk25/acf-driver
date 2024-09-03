'use client';
import React, { useState } from "react";
import { Car, User } from "../interfaces";
import { useDeleteCar } from "@/firebase/hooks/car";
import { useDeleteEventCarByCar } from "@/firebase/hooks/eventCar";
import { useHapticsContext } from "@/providers/HapticsProvider";
import ConfirmationButton from "@/components/ConfirmationButton";
import UpdateCar from "./UpdateCar";
import Modal from "@/components/Modal";

interface CarProps {
    car: Car;
    owner?: User;
}

const CarItem: React.FC<CarProps> = ({ car, owner }) => {

    const { mutate, isError } = useDeleteCar();
    const { mutate: deleteEventCar } = useDeleteEventCarByCar();
    const { snackbar } = useHapticsContext();

    const [showUpdateCarModal, setShowUpdateCarModal] = useState(false);

    const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : "Unknown";

    const handleDeleteCar = async () => {
        mutate(car);
        deleteEventCar(car.id);
        
        if (isError) {
            snackbar("Error deleting car", "error");
            return;
        }

        snackbar("Car deleted successfully", "success");
    }

    return (
        <section>
            <h1>Car</h1>
            <div className='item bg-violet-300'>
                {owner && <p>Owner: {ownerName}</p>}
                <p>Description: {car.description}</p>
                <p>Seats: {car.seats}</p>

                {owner && owner.uid === car.uid && <button onClick={() => setShowUpdateCarModal(true)}>Update Car</button>}
                {owner && owner.uid === car.uid && <ConfirmationButton onClick={handleDeleteCar}>Delete Car</ConfirmationButton>}

                {showUpdateCarModal &&
                    <Modal onClose={() => setShowUpdateCarModal(false)}>
                        <UpdateCar car={car} onComplete={() => setShowUpdateCarModal(false)} />
                    </Modal>
                }

            </div>
        </section>
    );
}

export default CarItem;