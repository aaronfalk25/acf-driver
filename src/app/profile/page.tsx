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
        };

        fetchUser();
    }, [getCurrentUser]);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <section>
            <h1>Profile</h1>
            { user && (
                <Profile isCurrentUser suppliedUser={user} />
            )}
        </section>
    );
}

export default CurrentProfile;
