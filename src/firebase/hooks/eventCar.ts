import { useQuery, useMutation, useQueryClient } from 'react-query';
import { readData, writeData, deleteData } from '../datastore';
import { EventCar, EventCarCreate } from '@/app/interfaces';
import { v4 as uuidv4 } from 'uuid';

export function useGetEventCar(eventId: string, carId: string): ReturnType<typeof useQuery> {
    return useQuery(['eventCar', eventId, carId], () => readData('eventCars', { eventId, carId }));
}

export function useGetEventCarByEvent(eventId: string): ReturnType<typeof useQuery> {
    return useQuery(['eventCars', eventId], () => readData('eventCars', { eventId }, false));
}

export function useGetEventCarByCar(carId: string): ReturnType<typeof useQuery> {
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

export function useDeleteEventCar() {
    const queryClient = useQueryClient();
    return useMutation((eventCar: EventCar) => deleteData('eventCars', eventCar.id), {
        onSuccess: () => {
            queryClient.invalidateQueries('eventCars');
        },
    });
}

export function useDeleteEventCarByEvent() {
    const queryClient = useQueryClient();
    return useMutation((eventId: string) => deleteData('eventCars', eventId, 'eventId'), {
        onSuccess: () => {
            queryClient.invalidateQueries('eventCars');
        },
    });
}

export function useDeleteEventCarByCar() {
    const queryClient = useQueryClient();
    return useMutation((carId: string) => deleteData('eventCars', carId, 'carId'), {
        onSuccess: () => {
            queryClient.invalidateQueries('eventCars');
        },
    });
}