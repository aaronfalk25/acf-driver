'use client';
import React, { useState } from 'react';

interface ConfirmationButtonProps {
    children: React.ReactNode;
    confirmationMessage?: string;
    onClick?: () => void;
}

const ConfirmationButton: React.FC<ConfirmationButtonProps> = ({ children, confirmationMessage = "Confirm", onClick }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleConfirmationButtonPress = () => {
        if (showConfirmation) {
            if (onClick) {
                onClick();
            }
            setShowConfirmation(false);
        }

        setShowConfirmation(true);
    }

    return (
        <div className='flex flex-row'>
            <button onClick={() => handleConfirmationButtonPress()}>{showConfirmation ? confirmationMessage : children}</button>
            {showConfirmation && (
                <div>
                    <button onClick={() => setShowConfirmation(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default ConfirmationButton;