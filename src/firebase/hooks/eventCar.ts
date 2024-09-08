import { useQuery, useMutation, useQueryClient } from 'react-query';
import { readData, writeData, deleteData } from '../datastore';
import { EventCar, EventCarCreate, Participant } from '@/app/interfaces';
import { v4 as uuidv4 } from 'uuid';

export function useGetEventCar(eventId: string, carId: string) {
    return useQuery(['eventCar', eventId, carId], () => readData('eventCars', { eventId, carId }));
}

export function useGetEventCarByEvent(eventId: string) {
    return useQuery(['eventCars', eventId], () => readData('eventCars', { eventId }, false));
}

export function useGetEventCarByCar(carId: string) {
    return useQuery(['eventCars', carId], () => readData('eventCars', { carId }, false));
}

export function useCreateEventCar() {
    const queryClient = useQueryClient();

    return useMutation(
        (eventCarCreate: EventCarCreate) => {
            const eventCar = { ...eventCarCreate, id: uuidv4() };
            return writeData('eventCars', eventCar, eventCar.id);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('eventCars');
            },
        }
    );
}

function removeEventCarFromParticipants(eventCarId: string) {
    return readData('participants', { eventCarId }, false).then((response) => {
        if (response.success) {
            const participants = response.data.participants;
            if (!participants) return;
            participants.forEach((participant: Participant) => {
                writeData('participants', { ...participant, eventCarId: "" }, participant.id);
            });
        }
    });
}

export function useDeleteEventCar() {
    const queryClient = useQueryClient();
    return useMutation((eventCar: EventCar) => deleteData('eventCars', eventCar.id), {
        onSuccess: (data, variables) => {
            const { id } = variables;
            removeEventCarFromParticipants(id);
            queryClient.invalidateQueries('eventCars');
            queryClient.invalidateQueries(['participants']);
            queryClient.removeQueries('carsByEvent');
        },
    });
}

export function useDeleteEventCarById() {
    const queryClient = useQueryClient();
    return useMutation((id: string) => deleteData('eventCars', id), {
        onSuccess: (data, id) => {
            removeEventCarFromParticipants(id);
            queryClient.invalidateQueries('eventCars');
            queryClient.invalidateQueries(['participants']);
            queryClient.invalidateQueries(['carsByEvent']);
        },
    });
}

function removeEventCarFromParticipantsByEvent(eventId: string) {
    return readData('participants', { eventId }, false).then((response) => {
        if (response.success) {
            const participants = response.data.participants;
            if (!participants) return;
            participants.forEach((participant: Participant) => {
                writeData('participants', { ...participant, eventCarId: "" }, participant.id);
            });
        }
    });
}

export function useDeleteEventCarByEvent() {
    const queryClient = useQueryClient();
    return useMutation((eventId: string) => deleteData('eventCars', eventId, 'eventId'), {
        onSuccess: (data, id) => {
            removeEventCarFromParticipantsByEvent(id);
            queryClient.invalidateQueries('eventCars');
            queryClient.invalidateQueries(['participants']);
            queryClient.removeQueries('carsByEvent');
        },
    });
}

function removeEventCarFromParticipantsByCar(carId: string) {
    return readData('participants', { carId }, false).then((response) => {
        if (response.success) {
            const participants = response.data.participants;
            if (!participants) return;
            participants.forEach((participant: Participant) => {
                writeData('participants', { ...participant, eventCarId: "" }, participant.id);
            });
        }
    });
}

export function useDeleteEventCarByCar() {
    const queryClient = useQueryClient();
    return useMutation((carId: string) => deleteData('eventCars', carId, 'carId'), {
        onSuccess: (data, id) => {
            removeEventCarFromParticipantsByCar(id);
            queryClient.invalidateQueries('eventCars');
            queryClient.invalidateQueries(['participants']);
            queryClient.removeQueries('carsByEvent');
        },
    });
}

export function useDeleteEventCarByUserByEvent() {
    const queryClient = useQueryClient();
  
    const fetchEventCarByUserAndEvent = async (uid: string, eventId: string) => {
      const response = await readData('eventCars', { uid, eventId });
      if (response.success) {
        return response.data;
      }
      return null; 
    };
  
    return useMutation(
      async ({ uid, eventId }: { uid: string; eventId: string }) => {
        const eventCar = await fetchEventCarByUserAndEvent(uid, eventId);
        if (eventCar && eventCar.id) {
          const res = await deleteData('eventCars', eventCar.id);
          removeEventCarFromParticipants(eventCar.id);
          return res;
        }
        return null;
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('eventCars');
          queryClient.invalidateQueries(['participants']);
          queryClient.removeQueries('carsByEvent');
        },
      }
    );
  }