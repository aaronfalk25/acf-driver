'use client'
import { Event } from '@/app/interfaces';
import React, { useEffect, useState } from 'react';
import { useDeleteEvent } from '@/firebase/hooks/event';
import Modal from '@/components/Modal';
import UpdateEvent from './UpdateEvent';
import { useHapticsContext } from '@/providers/HapticsProvider';
import { useRouter } from 'next/navigation';
import { formatDatetime } from '../utils/date';
import ConfirmationButton from '@/components/ConfirmationButton';

interface EventProps {
    event: Event;
    currentUid: string | undefined;
}

const EventItem: React.FC<EventProps> = ({ event, currentUid }) => {
    const [isOwner, setIsOwner] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const { mutate } = useDeleteEvent();

    const { snackbar } = useHapticsContext();

    const router = useRouter();

    useEffect(() => {
        if (event.createBy === currentUid) {
            setIsOwner(true);
        }
    }, [event.createBy, currentUid]);

    const handleDelete = async () => {
        mutate(event);
        snackbar("Event deleted successfully", "success");
    };

    return (
        <div className='item'>
            <a onClick={() => router.push(`/event/${event.id}`)}>{event.title}</a>
            <p>{event.description}</p>
            <p>{formatDatetime(event.eventDate)}</p>
            {isOwner && <button onClick={() => setShowEditModal(true)}>Edit</button>}
            {isOwner && <ConfirmationButton onClick={() => handleDelete()}>Delete</ConfirmationButton>}

            {showEditModal && (
                <Modal onClose={() => setShowEditModal(false)}>
                    <UpdateEvent event={event} onComplete={() => setShowEditModal(false)} />
                </Modal>
            )}
        </div>
    );
}

export default EventItem;