import { auth } from "../../context/AuthContext";
import { UserSignin, UserCreate } from "../../app/interfaces";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export function signup(userData: UserCreate): Promise<any> {
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

export function signin(userData: UserSignin): Promise<any> {
    const { email, password } = userData;

    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return user;
        })
}
