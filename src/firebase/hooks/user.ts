import { useCallback } from "react";
import { readData } from "../datastore";
import { User } from "../../app/interfaces";
import { useFirebase } from "../../providers/FirebaseProvider";
import { deleteData, updateData } from "../datastore";
import { useQuery, useMutation, useQueryClient } from 'react-query';

export const useUser = () => {
    const { user, isLoading: isFirebaseLoading } = useFirebase();

    const getUser = useCallback(
        async (uid: string): Promise<User | null> => {
            const userResponse = await readData("users", { uid });

            if (userResponse.success) {
                return userResponse.data as User;
            }
            return null;
        },
        []
    );

    const getCurrentUser = useCallback(async (): Promise<User | null> => {
        if (user) {
            return getUser(user.uid);
        }
        return null;
    }, [user, getUser]);

    const deleteUser = useCallback(async (uid: string): Promise<boolean> => {
        if (uid) {
            const response = await deleteData("users", uid);
            return response.success;
        }
        return false;
    }, []);

    return {
        getUser,
        getCurrentUser,
        isLoading: isFirebaseLoading,
        deleteUser,
    };
};

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
    return useQuery(['user'], () => readData('users', { uid }, false));
}

export function useGetCurrentUser() {
    const { user } = useFirebase();
    return useQuery(['user'], () => readData('users', { uid: user?.uid }, false));
}