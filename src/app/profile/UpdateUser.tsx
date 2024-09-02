'use client';
import React, { useState } from 'react';
import { useUpdateUser } from '@/firebase/hooks/user';
import { User, UserUpdate } from '@/app/interfaces';
import { useHapticsContext } from '@/providers/HapticsProvider';

interface UpdateUser {
    user: User;
    onComplete: () => void;
    accessAdmin?: boolean;
}

const UpdateUser: React.FC<UpdateUser> = ({ user, onComplete, accessAdmin }) => {
    const { mutate: updateUser } = useUpdateUser();
    const { snackbar } = useHapticsContext();
    const [updatedUser, setUpdateUser] = useState<UserUpdate>({
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdateUser({
            ...updatedUser,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!updatedUser.firstName || !updatedUser.lastName) {
            snackbar("Please fill out all required fields", "error");
            return;
        }

        const userUpdate: User = {
            uid: user.uid,
            email: user.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            isAdmin: updatedUser.isAdmin,
        }
        updateUser(userUpdate);
        snackbar("User updated successfully", "success");
        onComplete();
    }

    return (
        <section>
            <h1>Update User</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    First Name*
                    <input
                        type="text"
                        name="firstName"
                        value={updatedUser.firstName}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Last Name*
                    <input
                        type="text"
                        name="lastName"
                        value={updatedUser.lastName}
                        onChange={handleChange}
                    />
                </label>
                {accessAdmin &&
                <label>
                    Admin
                    <input
                        type="checkbox"
                        name="isAdmin"
                        checked={updatedUser.isAdmin}
                        onChange={handleChange}
                    />
                </label>
                }
                <button type="submit">Update User</button>
            </form>
        </section>
    );


}

export default UpdateUser;