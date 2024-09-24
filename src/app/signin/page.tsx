'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHapticsContext } from '@/providers/HapticsProvider';
import { useFirebase } from '@/providers/FirebaseProvider';

const Signin: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [justPressedSignin, setJustPressedSignin] = useState(false);
    const router = useRouter();

    const { loginWithEmailAndPassword, user, isLoading } = useFirebase();

    const { snackbar } = useHapticsContext();

    useEffect(() => {
        if (!isLoading && user && !justPressedSignin) {
            snackbar('Already signed in.', 'info');
            router.push('/profile');
        }
    }, [isLoading, user]);

    async function signin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setJustPressedSignin(true);

        try {
            const loginResponse = await loginWithEmailAndPassword(email, password);

            if (loginResponse.success) {
                router.push('/profile');
            } else {
                snackbar(loginResponse?.error ?? 'Login failed', 'error');
                setJustPressedSignin(false);
            }
        } catch (error) {
            snackbar('Sign in failed', 'error');
            setJustPressedSignin(false);
        }
    }

    return (
        <section>
            <h1>Sign In</h1>
            <form onSubmit={signin}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button type="submit">Sign in</button>
            </form>
        </section>
    );
}

export default Signin;