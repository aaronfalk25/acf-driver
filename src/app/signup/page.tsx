"use client";
import { useState } from "react";
import { UserCreate } from "../interfaces";
import { useNotificationContext } from "../../context/NotificationContext";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const { snackbar } = useNotificationContext();

    const router = useRouter();

    async function signup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password !== confirmPassword) {
            snackbar("Passwords do not match", 'error');
            return;
        }

        const user: UserCreate = {
            email,
            password,
            firstName,
            lastName,
            is_admin: false,
        }

        try {
            const signupResponse = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            const data = await signupResponse.json();

            if (signupResponse.ok) {
                snackbar('Signup successful!', 'success')
            } else {
                if (data.message === "Firebase: Error (auth/email-already-in-use).") {
                    // Signin user
                    snackbar(`Email already in use. Trying to sign in as ${user.email}`, 'warning');
                    const signinResponse = await fetch('/api/signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: user.email, password: user.password }),
                    });

                    const signinData = await signinResponse.json();

                    if (signinResponse.ok) {
                        snackbar('Signin successful!', 'success');
                        router.push('/profile');
                    } else {
                        console.error('Signin failed');
                        snackbar(signinData.message, 'error');
                    }
                }
                else {
                    console.error('Signup failed');
                    snackbar(data.message, 'error');
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
