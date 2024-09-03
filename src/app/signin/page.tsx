'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHapticsContext } from '@/providers/HapticsProvider';
import { useFirebase } from '@/providers/FirebaseProvider';

const Signin: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const router = useRouter();

    const { loginWithEmailAndPassword, user, isLoading } = useFirebase();

    const { snackbar } = useHapticsContext();

    useEffect(() => {
        if (!isLoading && user) {
            snackbar('Already logged in.', 'info');
            router.push('/profile');
        }
    }, []);


    async function signup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const loginResponse = await loginWithEmailAndPassword(email, password);

            if (loginResponse.success) {
                router.push('/profile');
            } else {
                snackbar(loginResponse?.error ?? 'Login failed', 'error');
            }
        } catch (error) {
            snackbar('Login failed', 'error');
        }
    }

    return (
        <section>
            <h1>Sign In</h1>
            <form onSubmit={signup}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="submit">Signin</button>
            </form>
        </section>
    );
}

export default Signin;