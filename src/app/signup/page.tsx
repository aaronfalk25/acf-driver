"use client";
import { useState } from "react";
import { UserCreate } from "../interfaces";
import { useNotificationContext } from "../../context/NotificationContext";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const { snackbar } = useNotificationContext();

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

            if (!signupResponse.ok) {
                console.error('Signup failed');
                const data = await signupResponse.json();
                snackbar(data.message, 'error');
            } else {
                console.log('Signup successful');
                snackbar('Signup successful!', 'success')
            }

            console.log("Response: ", signupResponse);
            const data = await signupResponse.json();
            console.log("Data: ", data);

        } catch (error) {
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
