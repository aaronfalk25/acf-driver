'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/firebase/user';
import { User } from '@/app/interfaces';
import { useFirebase } from '@/providers/FirebaseProvider';
import { useRouter } from 'next/navigation';

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const { getCurrentUser, isLoading } = useUser();
    const { logout } = useFirebase();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    }

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
            <div>
                <h1>Profile</h1>
                { user && (
                    <div>
                        <p>Email: {user.email}</p>
                        <p>First Name: {user.firstName}</p>
                        <p>Last Name: {user.lastName}</p>
                    </div>
                )}
            </div>
            <button onClick={handleLogout}>Logout</button>
        </section>
    );
}

export default Profile;
