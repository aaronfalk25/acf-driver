'use client';
import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

const Profile: React.FC = () => {
    const { user } = useAuthContext();

    console.log("USER: ", user);

    return (
        <div>
            <h1>Profile</h1>
            <p>Email: {user?.email}</p>
            <p>First Name: {user?.displayName}</p>
            <p>Last Name: {user?.lastName}</p>
        </div>
    );
}

export default Profile;
