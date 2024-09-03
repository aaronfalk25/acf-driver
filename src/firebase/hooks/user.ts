import { useCallback } from "react";
import { readData } from "../datastore";
import { User } from "../../app/interfaces";
import { useFirebase } from "../../providers/FirebaseProvider";
import { deleteData, updateData } from "../datastore";
import { useQuery, useMutation, useQueryClient } from 'react-query';

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation((user: User) => updateData('users', user, user.uid), {
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation((uid: string) => deleteData('users', uid), {
        onSuccess: () => {
            queryClient.invalidateQueries('users');
        },
    });
}

export function useGetUser(uid: string) {
    return useQuery(
        ['user', uid],
        async () => {
            if (uid) {
                return await readData('users', { uid });
            } else {
                return null;
            }
        }
    );
}

export function useGetCurrentUser() {
    const { user, isLoading } = useFirebase();

    return useQuery(
        ['user', user?.uid],
        async () => {
            if (user) {
                return await readData('users', { uid: user.uid });
            } else {
                return { success: false, error: null, data: null };
            }
        },
        {
            enabled: !isLoading,
        }
    );
}