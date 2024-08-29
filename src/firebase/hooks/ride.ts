import { useQuery, useMutation, useQueryClient } from "react-query";
import { readData, writeData, updateData, deleteData } from "../datastore";
import { Ride, RideCreate } from "@/app/interfaces";
import { v4 as uuidv4 } from "uuid";

export function useGetRide(id: string): ReturnType<typeof useQuery>;
export function useGetRide(eventId: string, carId: string, participantId: string): ReturnType<typeof useQuery>;

export function useGetRide(arg1: string, arg2?: string, arg3?: string) {
    if (arg2 && arg3) {
        return useQuery(['ride', arg1, arg2, arg3], () => readData("rides", { eventId: arg1, carId: arg2, participantId: arg3 }));
    } else {
        return useQuery(['ride', arg1], () => readData("rides", { id: arg1 }));
    }
}

export function useGetRideByEvent(eventId: string) {
    return useQuery(['rides', eventId], () => readData("rides", { eventId }, false));
}

export function useGetRideByEventByCar(eventId: string, carId: string) {
    return useQuery(['rides', eventId, carId], () => readData("rides", { eventId, carId }, false));
}

export function useGetRideByParticipant(participantId: string) {
    return useQuery(['rides', participantId], () => readData("rides", { participantId }, false));
}

export function useCreateRide() {
    const queryClient = useQueryClient();

    return useMutation(
        (rideCreate: RideCreate) => {
            const ride = { ...rideCreate, id: uuidv4() };
            return writeData("rides", ride, ride.id);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('rides');
            },
        }
    );
}

export function useUpdateRide() {
    const queryClient = useQueryClient();
    return useMutation((ride: Ride) => updateData("rides", ride, ride.id), {
        onSuccess: () => {
            queryClient.invalidateQueries('rides');
        },
    });
}

export function useDeleteRide() {
    const queryClient = useQueryClient();
    return useMutation((ride: Ride) => deleteData("rides", ride.id), {
        onSuccess: () => {
            queryClient.invalidateQueries('rides');
        },
    });
}

export function useDeleteRideByEvent() {
    const queryClient = useQueryClient();
    return useMutation((eventId: string) => deleteData("rides", eventId, "eventId"), {
        onSuccess: () => {
            queryClient.invalidateQueries('rides');
        },
    });
}

export function useDeleteRideByCar() {
    const queryClient = useQueryClient();
    return useMutation((carId: string) => deleteData("rides", carId, "carId"), {
        onSuccess: () => {
            queryClient.invalidateQueries('rides');
        },
    });
}

export function useDeleteRideByParticipant() {
    const queryClient = useQueryClient();
    return useMutation((participantId: string) => deleteData("rides", participantId, "participantId"), {
        onSuccess: () => {
            queryClient.invalidateQueries('rides');
        },
    });
}