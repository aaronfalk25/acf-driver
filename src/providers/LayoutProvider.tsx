"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import FirebaseProvider from "./FirebaseProvider";
import * as firebaseConfig from "@/../config.json";
import { HapticsContextProvider } from "./HapticsProvider";
import { QueryProvider } from "./QueryProvider";

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function LayoutProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<FirebaseProvider auth={auth}>
				<QueryProvider>
					<HapticsContextProvider>
						{children}
					</HapticsContextProvider>
				</QueryProvider>
			</FirebaseProvider>
		</>
	);
}