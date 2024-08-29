'use client'
import { Event } from '@/app/interfaces';
import React, { useEffect, useState } from 'react';
import { useDeleteEvent } from '@/firebase/hooks/event';
import { useDeleteParticipantByEvent } from '@/firebase/hooks/participant';
import Modal from '@/components/Modal';
import UpdateEvent from './UpdateEvent';
import { useHapticsContext } from '@/providers/HapticsProvider';
import { useRouter } from 'next/navigation';
import { formatDatetime } from '../utils/date';
import ConfirmationButton from '@/components/ConfirmationButton';
import CreateParticipant from './CreateParticipant';
import { useGetParticipants } from '@/firebase/hooks/participant';
import { isEmpty } from '../utils/common';

interface EventProps {
    event: Event;
    currentUid: string | undefined;
}

const EventItem: React.FC<EventProps> = ({ event, currentUid }) => {
    const [isOwner, setIsOwner] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateParticipantModal, setShowCreateParticipantModal] = useState(false);
    const [numParticipants, setNumParticipants] = useState(0);

    const { mutate } = useDeleteEvent();
    const { mutate: deleteParticipants } = useDeleteParticipantByEvent();

    const { snackbar } = useHapticsContext();

    const router = useRouter();

    const { data: participantsData, isLoading: participantsLoading } = useGetParticipants(event.id);
    
    useEffect(() => {
        console.log(participantsData);
        if (participantsData && participantsData.success && !isEmpty(participantsData.data)) {
            
            setNumParticipants(participantsData.data.participants.length);
        }
    }, [participantsData, participantsLoading])

    
    useEffect(() => {
        if (event.createBy === currentUid) {
            setIsOwner(true);
        }
    }, [event.createBy, currentUid]);

    const handleDelete = async () => {
        mutate(event);
        deleteParticipants(event.id);
        snackbar("Event deleted successfully", "success");
    };

    return (
        <div className='item'>
            <a onClick={() => router.push(`/event/${event.id}`)}>{event.title}</a>
            <p>{event.description}</p>
            <p>{formatDatetime(event.eventDate)}</p>
            
            {/** TODO: Implement Modal for clicking Number of Participants that shows Participant object */}
            <p>Number of participants: {numParticipants}</p>

            <button onClick={() => setShowCreateParticipantModal(true)}>Request a ride</button>

            {isOwner && <button onClick={() => setShowEditModal(true)}>Edit</button>}
            {isOwner && <ConfirmationButton onClick={() => handleDelete()}>Delete</ConfirmationButton>}

            {showEditModal && (
                <Modal onClose={() => setShowEditModal(false)}>
                    <UpdateEvent event={event} onComplete={() => setShowEditModal(false)} />
                </Modal>
            )}

            {showCreateParticipantModal && (
                <Modal onClose={() => setShowCreateParticipantModal(false)}>
                    <CreateParticipant eventId={event.id} onComplete={() => setShowCreateParticipantModal(false)} />
                </Modal>
            )}
        </div>
    );
}

export default EventItem;