'use client';
import { useParams } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { useUser, useGetUser } from '@/firebase/hooks/user';
import { User, Car } from '@/app/interfaces';
import { useFirebase } from '@/providers/FirebaseProvider';
import { useRouter } from 'next/navigation'
import { useDeleteCarByUser, useGetCarsByUser } from "@/firebase/hooks/car";
import { useDeleteEventCarByCar } from "@/firebase/hooks/eventCar";
import UserVehicles from '../UserVehicles';
import ConfirmationButton from "@/components/ConfirmationButton";
import { useHapticsContext } from "@/providers/HapticsProvider";
import Modal from "@/components/Modal";
import UpdateUser from "../UpdateUser";

interface ProfileProps {
    isCurrentUser?: boolean;
    suppliedUser?: User;
}

const Profile: React.FC<ProfileProps> = ({ isCurrentUser=false, suppliedUser }) => {
    const { id } = useParams();

    const [user, setUser] = useState<User | null>(suppliedUser ?? null);
    const [currentUser, setCurrentUser] = useState<User | null>(isCurrentUser ? suppliedUser ?? null : null);

    const { getUser, isLoading, getCurrentUser, deleteUser } = useUser();
    const { data: userData } = useGetUser(id as string); // TODO: Refactor to use useGetUser throughout code rather than useUser

    const { mutate: deleteCarByUser } = useDeleteCarByUser();
    const { data: carData } = useGetCarsByUser(suppliedUser?.uid ?? '');
    const { mutate: deleteEventCarByCar } = useDeleteEventCarByCar();
    const { logout, deleteAccount } = useFirebase();
    const { snackbar } = useHapticsContext();

    const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);

    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        snackbar("Logged out successfully", "success");
        router.push('/');
    }

    const handleDeleteAccount = async () => {
        if (suppliedUser) {
            await deleteAccount();
            await deleteUser(suppliedUser.uid);
            await deleteCarByUser(suppliedUser.uid);

            if (carData?.success && carData?.data) {
                carData.data.cars.forEach(async (car: Car) => {
                    await deleteEventCarByCar(car.id);
                });
            }

            snackbar("Account deleted successfully", "success");
            router.push('/');
        }

    }

    useEffect(() => {
        if (!suppliedUser) {
            const fetchUser = async () => {
                const currentUser = await getUser(id as string);
                setUser(currentUser);
            };

            const fetchCurrentUser = async () => {
                const currentUser = await getCurrentUser();
                setCurrentUser(currentUser);
            }
    
            fetchUser();
            fetchCurrentUser();
        }
    }, [getUser, getCurrentUser]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <section>
            <div>
                <h1>Profile</h1>
                { user && (
                    <>
                    <div className='item bg-slate-300'>
                        <p>Email: {user.email}</p>
                        <p>First Name: {user.firstName}</p>
                        <p>Last Name: {user.lastName}</p>

                        {(isCurrentUser || suppliedUser?.isAdmin || true) && (
                            <button onClick={() => setShowUpdateProfileModal(true)}>Update Profile</button>
                        )}
                    </div>


                    <UserVehicles user={user} owner={currentUser ?? undefined} />
                    </>
                )}


            </div>


            <div className='button-container'>
            {isCurrentUser && <button onClick={handleLogout}>Logout</button>}

            {isCurrentUser && <ConfirmationButton onClick={handleDeleteAccount}>Delete Account</ConfirmationButton>}
            </div>

            {showUpdateProfileModal && user && currentUser &&
                <Modal onClose={() => setShowUpdateProfileModal(false)}>
                    <UpdateUser user={user} onComplete={() => setShowUpdateProfileModal(false)} accessAdmin={!!currentUser?.isAdmin} />
                </Modal>
            }
        </section>
    );
}

export default Profile;