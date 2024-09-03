'use client';
import { useParams } from 'next/navigation';
import { Event, User } from '@/app/interfaces';
import React, { useState, useEffect } from 'react';
import { useGetEvent } from '@/firebase/hooks/event';
import { isEmpty } from '@/app/utils/common';
import EventItem from '../Event';
import { useGetCurrentUser } from '@/firebase/hooks/user';

const EventPage: React.FC = () => {
  const { id } = useParams();

  const [event, setEvent] = useState<Event | null>(null); 
  const [user, setUser] = useState<User | null>(null);

  const { data, isLoading } = useGetEvent(id.toString());
  const { data: currentUser, isLoading: isCurrentUserLoading } = useGetCurrentUser();

  useEffect(() => {
    if (!isCurrentUserLoading && currentUser) {
      setUser(currentUser.data);
      }
  }, [currentUser, isCurrentUserLoading]);

  useEffect(() => {
    if (data && data.success) {
      setEvent(data.data);
    }
  }
  , [data, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!event || isEmpty(event)) {
    return <div>Event not found</div>;
  }

  return (
    <section>
      <h1>Event</h1>
      <EventItem event={event} currentUid={user?.uid} />
    </section>
  );
    
}

export default EventPage;