"use-client";

import React, {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	Auth,
	AuthError,
	AuthErrorCodes,
	getIdToken,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	User,
	createUserWithEmailAndPassword,
} from "firebase/auth";


export enum FirebaseAuthError {
	NONE,
	INVALID_EMAIL,
	INVALID_PASSWORD,
	EMAIL_EXISTS,
	WEAK_PASSWORD,
	DELETE_FAILED,
}

type FirebaseProviderHooks = {
	isAuthenticated: boolean;
	user?: User;
	token: string;
	error: FirebaseAuthError;
	signUpWithEmailAndPassword(
		email: string,
		password: string
	): Promise<SignUpResponse>;
	loginWithEmailAndPassword(
		email: string,
		password: string
	): Promise<LoginResponse>;
	logout(next?: () => Promise<void>): Promise<void>;
	deleteAccount(): Promise<boolean>;
	isLoading: boolean;
};

type Props = {
	children: React.ReactNode;
	auth: Auth;
};

const FirebaseContext = createContext<FirebaseProviderHooks>(
	{} as FirebaseProviderHooks
);

interface SignUpResponse {
	success: boolean;
	error?: string;
	uid?: string;
}

interface LoginResponse {
	success: boolean;
	error?: string;
}

const FirebaseProvider: FC<Props> = ({ children, auth }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<User | undefined>();
	const [error, setError] = useState<FirebaseAuthError>(FirebaseAuthError.NONE);
	const [token, setToken] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getUserIdToken = useCallback(async (user: User) => {
		return await getIdToken(user);
	}, []);

	const resolveAuthError = useCallback((error: AuthError) => {
		switch (error.code) {
			case AuthErrorCodes.EMAIL_EXISTS:
				setError(FirebaseAuthError.EMAIL_EXISTS);
				break;
			case AuthErrorCodes.INVALID_EMAIL:
				setError(FirebaseAuthError.INVALID_EMAIL);
				break;
			case AuthErrorCodes.INVALID_PASSWORD:
				setError(FirebaseAuthError.INVALID_PASSWORD);
				break;
			case AuthErrorCodes.WEAK_PASSWORD:
				setError(FirebaseAuthError.WEAK_PASSWORD);
				break;
			default:
				setError(FirebaseAuthError.DELETE_FAILED);
		}
	}, []);

	const resolveAuthState = useCallback(
		async (user?: User) => {
			if (user) {
				const token = await getUserIdToken(user);
				setToken(token);
				setUser(user);
				setIsAuthenticated(true);
			} else {
				setUser(undefined);
				setIsAuthenticated(false);
				setError(FirebaseAuthError.NONE);
			}
			setIsLoading(false);
		},
		[getUserIdToken]
	);

	const signUpWithEmailAndPassword: FirebaseProviderHooks["signUpWithEmailAndPassword"] =
		useCallback(
			async (email: string, password: string): Promise<SignUpResponse> => {
				setError(FirebaseAuthError.NONE);
				try {
					const userCredential = await createUserWithEmailAndPassword(
						auth,
						email,
						password
					);

					if (userCredential.user) {
						await resolveAuthState(userCredential.user);
						return { success: true, uid: userCredential.user.uid };
					} else {
						return { success: false, error: "User not created" };
					}
				} catch (e: any) {
					resolveAuthError(e as AuthError);
					return { success: false, error: e.message ?? "Sign-up failed" };
				}
			},
			[auth, resolveAuthError, resolveAuthState]
		);

	const loginWithEmailAndPassword: FirebaseProviderHooks["loginWithEmailAndPassword"] =
		useCallback(
			async (email, password): Promise<LoginResponse> => {
				setError(FirebaseAuthError.NONE);
				try {
					const userCredential = await signInWithEmailAndPassword(
						auth,
						email,
						password
					);

					if (userCredential.user) {
						await resolveAuthState(userCredential.user);
						return { success: true };
					} else {
						return { success: false, error: "User not found" };
					}
				} catch (e: any) {
					resolveAuthError(e as AuthError);
					return { success: false, error: e.message ?? "Login failed" };
				}
			},
			[auth, resolveAuthError, resolveAuthState]
		);

	const logout: FirebaseProviderHooks["logout"] = useCallback(
		async (next) => {
			try {
				await signOut(auth);
				setToken("");
				setIsAuthenticated(false);
				setIsLoading(false);

				await next?.();
			} catch (e) {
				console.error(e);
			}
		},
		[auth]
	);

	const deleteAccount: FirebaseProviderHooks["deleteAccount"] = useCallback(
		async () => {
			try {
				if (user) {
					await user.delete();
					setUser(undefined);
					setIsAuthenticated(false);
					setError(FirebaseAuthError.NONE);
					return true;
				}
				return false;
			} catch (e) {
				console.error(e);
				resolveAuthError(e as AuthError);
				return false;
			}
		},
		[user, resolveAuthError]
	);

	useEffect(() => {
		return onAuthStateChanged(auth, async (user) => {
			await resolveAuthState(user ?? undefined);
		});
	}, [auth, resolveAuthState]);

	const value = useMemo(
		() => ({
			isAuthenticated,
			user,
			error,
			token,
			signUpWithEmailAndPassword,
			loginWithEmailAndPassword,
			logout,
			deleteAccount,
			isLoading,
		}),
		[
			isAuthenticated,
			user,
			error,
			token,
			signUpWithEmailAndPassword,
			loginWithEmailAndPassword,
			logout,
			deleteAccount,
			isLoading,
		]
	);
	return (
		<FirebaseContext.Provider value={value}>
			{" "}
			{children}{" "}
		</FirebaseContext.Provider>
	);
};

export const useFirebase = () => useContext(FirebaseContext);
export default FirebaseProvider;