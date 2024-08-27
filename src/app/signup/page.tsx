"use client";
import { useState, useEffect } from "react";
import { UserCreate, User } from "../interfaces";
import { useHapticsContext } from "../../providers/HapticsProvider";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/providers/FirebaseProvider";
import { writeData } from "@/firebase/datastore";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const { snackbar } = useHapticsContext();

    const router = useRouter();

    const { signUpWithEmailAndPassword, loginWithEmailAndPassword, user, isLoading } = useFirebase();

    useEffect(() => {
        if (!isLoading && user) {
            snackbar('Please sign out before signing up as a different user.', 'info');
            router.push('/profile');
        }
    }, []);

    async function signup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password !== confirmPassword) {
            snackbar("Passwords do not match", 'error');
            return;
        }

        if (!email || !password || !firstName || !lastName) {
            snackbar("Please fill out all fields", 'error');
            return;
        }

        const user: UserCreate = {
            email,
            password,
            firstName,
            lastName,
            isAdmin: false,
        }

        try {
            const signupResponse = await signUpWithEmailAndPassword(email, password);
            
            if (signupResponse.success) {
                const uid = signupResponse.uid ?? '';
                if (uid === '') {
                    snackbar('Signup failed', 'error');
                    return;
                }

                const datastoreUser: User = {
                    uid,
                    email,
                    firstName,
                    lastName,
                    isAdmin: false,
                }

                const writeResponse = await writeData('users', datastoreUser, uid);
                if (writeResponse.success) {
                    snackbar('Signup successful!', 'success');

                    const signinResponse = await loginWithEmailAndPassword(email, password);

                    if (signinResponse.success) {
                        router.push('/profile');
                    }
                    else {
                        router.push('/');
                    }

                    
                }
                else {
                    snackbar(writeResponse.error?.toString() ?? 'Unknown signup error', 'error');
                }
            }
            else {
                if (signupResponse.error === "Firebase: Error (auth/email-already-in-use).") {
                    
                    // Signin user
                    snackbar(`Email already in use. Trying to sign in as ${user.email}`, 'warning');
                    const signinResponse = await loginWithEmailAndPassword(email, password);

                    if (signinResponse.success) {
                        router.push('/profile');
                    } else {
                        snackbar('Email already in use. Received the following error: ' + signinResponse.error ?? 'Unknown signin error', 'error');
                    }
                }
                else {
                    snackbar(signupResponse.error ?? 'Unknown signup error', 'error');
                }
            }

        } catch (error: any) {
            console.error('Error during signup', error);
        }
    }

    return (
        <section>
            <h1>Signup</h1>
            <form onSubmit={signup}>
                <label>
                    Email:
                    <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <label>
                    Confirm Password:
                    <input type="password" name="confirm_password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </label>
                <label>
                    First Name:
                    <input type="text" name="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </label>
                <label>
                    Last Name:
                    <input type="text" name="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </label>
                <button type="submit">Submit</button>
            </form>
        </section>
    );
}
