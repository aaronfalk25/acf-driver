'use client';
import { useParams } from 'next/navigation';
import { Event } from '@/app/interfaces';
import React, { useState, useEffect } from 'react';
import { useGetEvent } from '@/firebase/hooks/event';
import { formatDatetime } from '@/app/utils/dateFormatter';
import { isEmpty } from '@/app/utils/common';

const EventPage: React.FC = () => {
  const { id } = useParams();

  const [event, setEvent] = useState<Event | null>(null); 

  const { data, isLoading } = useGetEvent(id.toString());

  useEffect(() => {
    if (data && data.success) {
      setEvent(data.data);
    }
  }
  , [data, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isEmpty(event)) {
    return <div>Event not found</div>;
  }

  return (
    <section>
      <h1>{event?.title}</h1>
      <p>{event?.description}</p>
      <p>{formatDatetime(event?.eventDate)}</p>
    </section>
  );
}

export default EventPage;