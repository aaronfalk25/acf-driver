'use client'
import React, { useEffect, useState } from 'react';
import CreateEvent from './CreateEvent';
import { useGetCurrentUser } from '@/firebase/hooks/user';
import { User } from '@/app/interfaces';
import { useGetEvents } from '@/firebase/hooks/event';
import { Event } from '@/app/interfaces';
import Modal from '@/components/Modal';
import EventItem from './Event';
import { sortArray } from '../utils/common';

const Events: React.FC = () => {
    const { data: currentUser, isLoading } = useGetCurrentUser();

    const [user, setUser] = useState<User | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [sortedEvents, setSortedEvents] = useState<Event[]>([]);

    useEffect(() => {
        if (!isLoading && currentUser) {
            setUser(currentUser.data);
        }
    }, [currentUser, isLoading]);

    const { data, isLoading: eventsLoading } = useGetEvents();
    const events = data?.data.events;

    useEffect(() => {
        if (events) {
            setSortedEvents(sortArray([...events], 'eventDate'));
        }
    }, [events]);


    if (isLoading || eventsLoading) {
        return <div>Loading...</div>;
    }
    

    return (
        <section>
            <h1>Events</h1>
            {sortedEvents.map((event: Event) => (
                <EventItem key={event.id} event={event} currentUid={user?.uid} />
            ))}

            {user && (
                <>
                    <button onClick={() => setShowCreateModal(true)}>Create Event</button>
                    {showCreateModal && 
                        <Modal onClose={() => setShowCreateModal(false)}>
                            <CreateEvent uid={user.uid} onComplete={() => setShowCreateModal(false)} />
                        </Modal>
                    }
                </>
            )}
    
        </section>
    );
}


export default Events;