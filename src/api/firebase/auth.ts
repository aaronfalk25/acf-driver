import { auth } from "../../context/AuthContext";
import { UserCreate } from "../../app/interfaces";
import { createUserWithEmailAndPassword } from "firebase/auth";

export function signup(userData: UserCreate): Promise<any> {
    console.log("Calling signup...");

    const { email, password, firstName, lastName, is_admin } = userData;

    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return {
                ...user,
                firstName,
                lastName,
                is_admin,
            };
        })
}
