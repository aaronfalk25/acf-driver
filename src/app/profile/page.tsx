'use client';
import React, { useEffect, useState } from 'react';
import { useGetCurrentUser } from '@/firebase/hooks/user';
import { User } from '@/app/interfaces';
import { useRouter } from 'next/navigation';
import Profile from './[id]/page';
import { useHapticsContext } from '@/providers/HapticsProvider';

const CurrentProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const { data: currentUser, isLoading } = useGetCurrentUser();
    const { snackbar } = useHapticsContext();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && currentUser) {
            setUser(currentUser.data);
        }

        if (!isLoading && !currentUser) {
            snackbar("Please sign in to view your profile", "error");
            router.push('/signin');
        }
    }, [currentUser, isLoading]);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            { user && (
                <Profile isCurrentUser suppliedUser={user} />
            )}
        </>
    );
}

export default CurrentProfile;
