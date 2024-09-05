'use client';
import React, { useState } from "react";
import { useGetCarsByUser } from "@/firebase/hooks/car";
import { Car as _Car, User } from "@/app/interfaces";
import Car from "@/app/car/Car";
import CreateCar from "@/app/car/CreateCar";
import Modal from "@/components/Modal";
import { isEmpty } from "../utils/common";


interface UserVehiclesProps {
    user: User;
    owner?: User;
}

const UserVehicles: React.FC<UserVehiclesProps> = ({ user, owner }) => {

    const { data, isLoading, isError } = useGetCarsByUser(user.uid);

    const [showCreateCarModal, setShowCreateCarModal] = useState(false);

    return (
        <section className='item bg-slate-300'>
            <h2>User Vehicles</h2>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error</p>}
            {data && data.success && !isEmpty(data.data) && data.data.cars.map((car: _Car) => (
                <Car key={car.id} car={car} owner={owner} />
            ))}

            { owner && owner.uid === user.uid &&
                <button onClick={() => setShowCreateCarModal(true)}>Add Car</button> 
            }

            {showCreateCarModal &&
                <Modal onClose={() => setShowCreateCarModal(false)}>
                    <CreateCar uid={user.uid} onComplete={() => setShowCreateCarModal(false)} />
                </Modal>
            }

        </section>
    );
}

export default UserVehicles;
