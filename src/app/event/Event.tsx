'use client'
import { Event, Participant, EventCar } from '@/app/interfaces';
import React, { useEffect, useState } from 'react';
import { useDeleteEvent } from '@/firebase/hooks/event';
import { useDeleteParticipantByEvent } from '@/firebase/hooks/participant';
import { useGetEventCarByEvent, useDeleteEventCarByEvent } from '@/firebase/hooks/eventCar';
import Modal from '@/components/Modal';
import UpdateEvent from './UpdateEvent';
import { useHapticsContext } from '@/providers/HapticsProvider';
import { useRouter } from 'next/navigation';
import { formatDatetime } from '../utils/date';
import ConfirmationButton from '@/components/ConfirmationButton';
import CreateParticipant from './CreateParticipant';
import { useGetParticipants } from '@/firebase/hooks/participant';
import { isEmpty } from '../utils/common';
import ParticipantItem from '../participant/Participant';
import CreateEventCar from '../eventCar/CreateEventCar';
import EventCarItem from '../eventCar/EventCar';

interface EventProps {
    event: Event;
    currentUid: string | undefined;
}

const EventItem: React.FC<EventProps> = ({ event, currentUid }) => {
    const [isOwner, setIsOwner] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateParticipantModal, setShowCreateParticipantModal] = useState(false);
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);
    const [showCreateEventCarModal, setShowCreateEventCarModal] = useState(false);

    const [numParticipants, setNumParticipants] = useState(0);

    const { mutate } = useDeleteEvent();
    const { mutate: deleteParticipants } = useDeleteParticipantByEvent();
    const { mutate: deleteEventCar } = useDeleteEventCarByEvent();

    const { snackbar } = useHapticsContext();

    const router = useRouter();

    const { data: participantsData, isLoading: participantsLoading } = useGetParticipants(event.id);
    const { data: eventCarData, isLoading: eventCarLoading } = useGetEventCarByEvent(event.id);
    
    useEffect(() => {
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
        deleteEventCar(event.id);
        snackbar("Event deleted successfully", "success");
    };

    return (
        <div className='item'>
            <a onClick={() => router.push(`/event/${event.id}`)}>{event.title}</a>
            <p>{event.description}</p>
            
            <p>{formatDatetime(event.eventDate)}</p>

            <button onClick={() => setShowParticipantsModal(true)}>
            <p>Number of participants: {numParticipants}</p>
            </button>

            <button onClick={() => setShowCreateParticipantModal(true)}>Request a ride</button>

            {currentUid && <button onClick={() => setShowCreateEventCarModal(true)}>I can drive!</button>}

            {isOwner && <button onClick={() => setShowEditModal(true)}>Edit</button>}
            {isOwner && <ConfirmationButton onClick={() => handleDelete()}>Delete</ConfirmationButton>}

            {!eventCarLoading && eventCarData && eventCarData.success && !isEmpty(eventCarData.data) && eventCarData.data.eventCars.map((eventCar: EventCar) => (
                <EventCarItem key={eventCar.id} eventCar={eventCar} event={event} />
            ))}

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

            {showParticipantsModal && (
                <Modal onClose={() => setShowParticipantsModal(false)}>
                    <h1>Participants</h1>
                    {participantsData && participantsData.success && !isEmpty(participantsData.data) && participantsData.data.participants.map((participant: Participant) => (
                        <ParticipantItem key={participant.id} participant={participant} />
                    ))}
                </Modal>
            )}

            {showCreateEventCarModal && currentUid && (
                <Modal onClose={() => setShowCreateEventCarModal(false)}>
                    <CreateEventCar eventId={event.id} uid={currentUid} onComplete={() => setShowCreateEventCarModal(false)} />
                </Modal>
            )}
        </div>
    );
}

export default EventItem;