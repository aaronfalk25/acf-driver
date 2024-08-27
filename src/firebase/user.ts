import { useCallback } from "react";
import { readData } from "./datastore";
import { User } from "../app/interfaces";
import { useFirebase } from "../providers/FirebaseProvider";

export const useUser = () => {
    const { user, isLoading: isFirebaseLoading } = useFirebase();

    const getUser = useCallback(
        async (uid: string): Promise<User | null> => {
            const userResponse = await readData("users", uid);

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

    const isLoading = useCallback(() => {
        return isFirebaseLoading;
    }
    , [isFirebaseLoading]);

    return {
        getUser,
        getCurrentUser,
        isLoading,
    };
};
