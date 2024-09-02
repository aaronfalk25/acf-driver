'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/firebase/user';
import { User } from '@/app/interfaces';
import { useRouter } from 'next/navigation';
import Profile from './[id]/page';

const CurrentProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const { getCurrentUser, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            
            if (!isLoading && !currentUser) {
                router.push('/');
            }
        };

        fetchUser();
    }, [getCurrentUser, isLoading]);


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
