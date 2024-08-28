'use client'
import React, { useEffect, useState } from 'react';
import CreateEvent from './CreateEvent';
import { useUser } from '@/firebase/user';
import { User } from '@/app/interfaces';
import { useGetEvents } from '@/firebase/hooks/event';
import { Event } from '@/app/interfaces';
import Modal from '@/components/Modal';
import EventItem from './Event';
import { sortArrayByDate } from '@/app/utils/date';

const Events: React.FC = () => {
    const { getCurrentUser, isLoading } = useUser();

    const [user, setUser] = useState<User | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [sortedEvents, setSortedEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        };

        fetchUser();
    }, [getCurrentUser]);

    const { data, isLoading: eventsLoading } = useGetEvents();
    const events = data?.data.events;

    useEffect(() => {
        if (events) {
            setSortedEvents(sortArrayByDate(events, 'eventDate'));
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