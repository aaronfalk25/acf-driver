'use client';
import { useParams } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { useUser } from '@/firebase/user';
import { User } from '@/app/interfaces';
import { useFirebase } from '@/providers/FirebaseProvider';
import { useRouter } from 'next/navigation';
import UserVehicles from '../UserVehicles';

interface ProfileProps {
    isCurrentUser?: boolean;
    suppliedUser?: User;
}

const Profile: React.FC<ProfileProps> = ({ isCurrentUser=false, suppliedUser }) => {
    const { id } = useParams();

    const [user, setUser] = useState<User | null>(suppliedUser ?? null);
    const [currentUser, setCurrentUser] = useState<User | null>(isCurrentUser ? suppliedUser ?? null : null);

    const { getUser, isLoading, getCurrentUser } = useUser();
    const { logout } = useFirebase();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
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
                    <div className='item'>
                        <p>Email: {user.email}</p>
                        <p>First Name: {user.firstName}</p>
                        <p>Last Name: {user.lastName}</p>
                    </div>

                    <UserVehicles user={user} owner={currentUser ?? undefined} />
                    </>
                )}
            </div>

            {isCurrentUser && <button onClick={handleLogout}>Logout</button>}
        </section>
    );
}

export default Profile;