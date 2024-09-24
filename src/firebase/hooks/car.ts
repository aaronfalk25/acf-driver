import { useQuery, useMutation, useQueryClient } from 'react-query';
import { readData, writeData, updateData, deleteData } from '../datastore';
import { Car, CarCreate, EventCar } from '@/app/interfaces';
import { v4 as uuidv4 } from 'uuid';

export function useGetCar(id: string) {
    return useQuery(['car', id], () => readData('cars', { id }));
}

export function useGetCars() {
    return useQuery('cars', () => readData('cars'));
}

export function useGetCarsByEvent(eventId: string) {
    return useQuery(['carsByEvent', eventId], async () => {
      const eventCarsResponse = await readData('eventCars', { eventId }, false);
      const cars: Record<string, Car> = {};
  
      if (eventCarsResponse.success && eventCarsResponse.data) {
        const eventCars = eventCarsResponse.data.eventCars;
  
        if (!eventCars) {
          return cars;
        }

        const carPromises = eventCars.map((eventCar: EventCar) => readData('cars', { id: eventCar.carId }));
        const carResponses = await Promise.all(carPromises);
  
        carResponses.forEach((carResponse, index) => {
          const eventCar = eventCars[index];
          if (carResponse.success) {
            cars[eventCar.id] = carResponse.data;
          }
        });
      }
  
      return cars;
    });
  }

export function useCreateCar() {
    const queryClient = useQueryClient();

    return useMutation(
        (carCreate: CarCreate) => {
            const car = { ...carCreate, id: uuidv4() };
            return writeData('cars', car, car.id);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('cars');
            },
        }
    );
}

export function useUpdateCar() {
    const queryClient = useQueryClient();
    return useMutation((car: Car) => updateData('cars', car, car.id), {
        onSuccess: () => {
            queryClient.invalidateQueries('cars');
        },
    });
}

export function useDeleteCar() {
    const queryClient = useQueryClient();
    return useMutation((car: Car) => deleteData('cars', car.id), {
        onSuccess: () => {
            queryClient.invalidateQueries('cars');
        },
    });
}

export function useDeleteCarByUser() {
    const queryClient = useQueryClient();
    return useMutation((uid: string) => deleteData('cars', uid, 'uid'), {
        onSuccess: () => {
            queryClient.invalidateQueries('cars');
        },
    });
}

export function useGetCarsByUser(uid: string) {
    return useQuery(['cars', uid], () => readData('cars', { uid }, false));
}