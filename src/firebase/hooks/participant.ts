import { useQuery, useMutation, useQueryClient } from "react-query";
import { readData, writeData, updateData, deleteData } from "../datastore";
import { EventCar, Participant, ParticipantCreate } from "@/app/interfaces";
import { v4 as uuidv4 } from "uuid";

export function useGetParticipant(id: string) {
    return useQuery(['participant', id], () => readData("participants", { id }));
}

export function useGetParticipants(eventId: string) {
    return useQuery(['participants', eventId], () => readData("participants", { eventId }, false));
}

export function useGetParticipantsByEvent(eventId: string) {
    return useQuery(['participants', eventId], () => readData("participants", { eventId }, false));
}

export function useCreateParticipant() {
    const queryClient = useQueryClient();

    return useMutation(
        async (participantCreate: ParticipantCreate) => {
            const participant = { ...participantCreate, id: uuidv4() };
            return await writeData("participants", participant, participant.id);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('participants');
            },
        }
    );
}

export function useUpdateParticipant() {
    const queryClient = useQueryClient();
    return useMutation((participant: Participant) => updateData("participants", participant, participant.id), {
        onSuccess: () => {
            queryClient.invalidateQueries('participants');
        },
    });
}

export function useDeleteParticipant() {
    const queryClient = useQueryClient();
    return useMutation((participant: Participant) => deleteData("participants", participant.id), {
        onSuccess: () => {
            queryClient.invalidateQueries('participants');
        },
    });
}

export function useDeleteParticipantByEvent() {
    const queryClient = useQueryClient();
    return useMutation((eventId: string) => deleteData("participants", eventId, "eventId"), {
        onSuccess: () => {
            queryClient.invalidateQueries('participants');
        },
    });
}

export function useDeleteParticipantByEventCar() {
    const queryClient = useQueryClient();

    return useMutation(async (eventCarId: string) => {
        await deleteData("participants", eventCarId, "eventCarId");
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('participants');
        },
    });
}

export function useDeleteParticipantByCar() {
    const queryClient = useQueryClient();

    return useMutation(async (carId: string) => {
        const eventCars = await readData("eventCars", { carId }, false);

        if (eventCars.success && eventCars.data) {
            const eventCarIds = eventCars.data.eventCars.map((eventCar: EventCar) => eventCar.id);
            for (const eventCarId of eventCarIds) {
                await deleteData("participants", eventCarId, "eventCarId");
            }
        }
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('participants');
        },
    });
}