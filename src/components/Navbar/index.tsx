'use client';
import React, { useState, useEffect } from 'react';
import { useUser } from '@/firebase/user';
import { useRouter } from 'next/navigation';
import { User } from '@/app/interfaces';
import { useFirebase } from '@/providers/FirebaseProvider';
import { useHapticsContext } from '@/providers/HapticsProvider';

import "./navbar.css"

const Navbar: React.FC = () => {
    const { getCurrentUser, isLoading } = useUser();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    const { logout } = useFirebase();
    const { snackbar } = useHapticsContext();

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        };

        fetchUser();
    }, [getCurrentUser, isLoading]);

    const handleLogout = async () => {
        await logout();
        snackbar("Logged out successfully", "success");
        router.push('/');
    }

    return (
        <nav>
            <a href="/">Home</a>
            <a href="/event">Events</a>
            <a href="/profile">Profile</a>
            <div>
                {user ? (
                    <button onClick={handleLogout}>Signout</button>
                ) : (
                    <button onClick={() => router.push('/signin')}>Signin</button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;