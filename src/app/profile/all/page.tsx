'use client';
import React, { useEffect, useState } from 'react';
import { useGetCurrentUser, useGetAllUsers } from '@/firebase/hooks/user';
import { User } from '@/app/interfaces';
import { useRouter } from 'next/navigation';
import Profile from '../[id]/page';
import { useHapticsContext } from '@/providers/HapticsProvider';

const CurrentProfile: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { data: currentUserData, isLoading, isIdle } = useGetCurrentUser();
    const { data: users, isLoading: usersLoading } = useGetAllUsers();
    const { snackbar } = useHapticsContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && currentUserData?.data) {
            setCurrentUser(currentUserData.data);
        }

        if (!isLoading && !isIdle && !currentUserData?.data) {
            snackbar("Please sign in to view your profile", "error");
            router.push('/signin');
        }
    }, [currentUserData, isLoading, isIdle]);


    if (isLoading || usersLoading) {
        return <div>Loading...</div>;
    }


    return (
        <>
            { users && (
                users.data.users.map((user: User) => (
                    <Profile key={user.uid} 
                        suppliedUser={user} 
                        isCurrentUser={user.uid === currentUser?.uid} 
                        allowAdmin={currentUser?.isAdmin}
                    />
                ))
            )}
        </>
    );
}

export default CurrentProfile;
