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
import { formatDatetime, formatDatetimeShort } from '../utils/date';
import ConfirmationButton from '@/components/ConfirmationButton';
import CreateParticipant from './CreateParticipant';
import { useGetParticipants } from '@/firebase/hooks/participant';
import { isEmpty } from '../utils/common';
import ParticipantItem from '../participant/Participant';
import CreateEventCar from '../eventCar/CreateEventCar';
import EventCarItem from '../eventCar/EventCar';
import { isMobile } from '../utils/common';

interface EventProps {
    event: Event;
    currentUid: string | undefined;
    isAdmin: boolean;
}

const EventItem: React.FC<EventProps> = ({ event, currentUid, isAdmin }) => {
    const [isOwner, setIsOwner] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateParticipantModal, setShowCreateParticipantModal] = useState(false);
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);
    const [showCreateEventCarModal, setShowCreateEventCarModal] = useState(false);

    const [participants, setParticipants] = useState<Participant[]>([]);
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
            setParticipants(participantsData.data.participants);
            setNumParticipants(participantsData.data.participants.length);
        }
        else {
            setParticipants([]);
            setNumParticipants(0);
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
        <div className='item bg-amber-100'>

            <div className='row'>
                <h3><a onClick={() => router.push(`/event/${event.id}`)}>{event.title}</a></h3>
            </div>
            {event.description &&
                <div className='row'>
                    <p>{event.description}</p>
                </div>
            }   
            <div className='row'>
                <p>{isMobile() ? "Event:" : "Event information:"}</p>
                <p>{isMobile() ? formatDatetimeShort(event.eventDate) : formatDatetime(event.eventDate)}</p>
                <p>@ {event.eventLocation}</p>
            </div>
            <div className='row'>
                <p>{isMobile() ? "Pickup:" : "Pickup information:"}</p>
                <p>{isMobile() ? formatDatetimeShort(event.pickupDate) : formatDatetime(event.pickupDate)}</p>
                <p>@ {event.pickupLocation}</p>
            </div>

            <div className='row'>

                <button disabled={numParticipants===0} onClick={() => setShowParticipantsModal(true)}>
                    Number of participants: {numParticipants}
                </button>

                <button onClick={() => setShowCreateParticipantModal(true)}>Request a ride</button>

                {currentUid && <button onClick={() => setShowCreateEventCarModal(true)}>I can drive!</button>}

            </div>

            <div className='row'>

                {(isOwner || isAdmin) && <button onClick={() => setShowEditModal(true)}>Edit</button>}
                {(isOwner || isAdmin) && <ConfirmationButton onClick={() => handleDelete()}>Delete</ConfirmationButton>}

            </div>

            <div className='row'>
                {!eventCarLoading && eventCarData && eventCarData.success && isEmpty(eventCarData.data) ? (
                    <p>No drivers have signed up yet for this event.</p>
                ) : (
                    <div className='item bg-slate-300'>
                    <h2>Cars</h2>

                    {!eventCarLoading && eventCarData && eventCarData.success && !isEmpty(eventCarData.data) && eventCarData.data.eventCars.map((eventCar: EventCar) => (
                        <EventCarItem 
                            key={eventCar.id} 
                            eventCar={eventCar} 
                            participants={participants.filter(participant => participant.eventCarId && participant.eventCarId === eventCar.id)} 
                        />
                    ))}
                    </div>
                )}
              

            </div>

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
                        <ParticipantItem 
                            key={participant.id} 
                            participant={participant} 
                            onComplete={() => {setShowParticipantsModal(false)}} 
                        />
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