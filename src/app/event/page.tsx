'use client'
import React, { useEffect, useState } from 'react';
import CreateEvent from './CreateEvent';
import { useUser } from '@/firebase/user';
import { User } from '@/app/interfaces';
import { useGetEvents } from '@/firebase/hooks/event';
import { Event } from '@/app/interfaces';
import Modal from '@/components/Modal';

const Events: React.FC = () => {
    const { getCurrentUser, isLoading } = useUser();

    const [user, setUser] = useState<User | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        };

        fetchUser();
    }, [getCurrentUser]);

    const { data, isLoading: eventsLoading } = useGetEvents();
    const events = data?.data.events;

    if (isLoading || eventsLoading) {
        return <div>Loading...</div>;
    }
    

    return (
        <section>
            <h1>Events</h1>
            {events.map((event: Event) => (
                <div key={event.id}>
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                    <p>{event.eventDate.toString()}</p>
                </div>
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