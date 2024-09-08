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

export function useGetUsers(uids: string[]) {
    return useQuery(
      ['users', uids.join('|')],
      async () => {
        if (uids.length === 0) {
          return {};
        }
  
        const users: Record<string, User> = {};
        const userPromises = uids.map((uid: string) => readData('users', { uid }));
        const userResponses = await Promise.all(userPromises);
  
        userResponses.forEach((userResponse, index) => {
          const user = userResponses[index];
          if (user.success) {
            users[user.data.uid] = userResponse.data;
          }
        });
  
        return users;
      },
      {
        enabled: uids.length > 0,
      }
    );
  }
  

export function useGetAllUsers() {
    return useQuery(
        'users',
        async () => {
            return await readData('users', {}, false);
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