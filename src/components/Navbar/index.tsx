'use client';
import React, { useState, useEffect } from 'react';
import { useGetCurrentUser } from '@/firebase/hooks/user';
import { useRouter } from 'next/navigation';
import { User } from '@/app/interfaces';
import { useFirebase } from '@/providers/FirebaseProvider';
import { useHapticsContext } from '@/providers/HapticsProvider';

import "./navbar.css"

const Navbar: React.FC = () => {
    const { data: currentUser, isLoading } = useGetCurrentUser();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    const { logout } = useFirebase();
    const { snackbar } = useHapticsContext();

    useEffect(() => {
        if (currentUser && !isLoading) {
            setUser(currentUser.data);
        }
    }, [currentUser, isLoading]);

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
                    <div className='button-container'>
                    <button onClick={() => router.push('/signin')}>Sign in</button>
                    <button onClick={() => router.push('/signup')}>Sign up</button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;