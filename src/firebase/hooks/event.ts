import { useQuery, useMutation, useQueryClient } from "react-query";
import { readData, writeData, updateData, deleteData } from "../datastore";
import { Event, EventCreate } from "@/app/interfaces/Event";
import { v4 as uuidv4 } from "uuid";

export function useGetEvent(id: string) {
    return useQuery(['event', id], () => readData("events", { id }));
}

export function useGetEvents() {
    return useQuery('events', () => readData("events"));
}

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation(
        (eventCreate: EventCreate) => {
            const event = { ...eventCreate, id: uuidv4() };
            return writeData("events", event, event.id);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('events');
            },
        }
    );
}

export function useUpdateEvent() {
    const queryClient = useQueryClient();
    return useMutation((event: Event) => updateData("events", event, event.id), {
        onSuccess: () => {
            queryClient.invalidateQueries('events');
        },
    });
}

export function useDeleteEvent() {
    const queryClient = useQueryClient();
    return useMutation((event: Event) => deleteData("events", event.id), {
        onSuccess: () => {
            queryClient.invalidateQueries('events');
        },
    });
}
