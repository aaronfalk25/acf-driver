import { v4 as uuidv4 } from 'uuid';
import { app } from '@/providers/LayoutProvider';

// Generic write to firestore
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
const db = getFirestore(app);

function fnWrapper(fn: Function) {
    return async function(...args: any) {
        try {
            const res = await fn(...args);
            return {
                success: true,
                error: null,
                data: res
            }
        } catch (e) {
            return {
                success: false,
                error: e,
                data: null
            }
        }
    }
}

async function _write(collectionName: string, contents: any, docId: string = uuidv4()): Promise<void | Object> {
    const docRef = doc(collection(db, collectionName), docId);
    await setDoc(docRef, contents);
    return { id: docId, ...contents };
}

// Generic update id in firestore that may or may not exist
import { updateDoc } from "firebase/firestore";
async function _update(collectionName: string, contents: any, docId: string) {
    const docRef = doc(collection(db, collectionName), docId);
    await updateDoc(docRef, contents);
}

// Generic read entire collection
import { getDocs, query, where, CollectionReference, DocumentData } from "firebase/firestore";
import { Collection as _Collection, Document } from "../app/interfaces";
import { Timestamp } from "firebase/firestore";
function convertTimestampsToDates(data: any): any {
    if (data instanceof Timestamp) {
        return data.toDate();
    } else if (Array.isArray(data)) {
        return data.map(item => convertTimestampsToDates(item));
    } else if (typeof data === 'object' && data !== null) {
        return Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, convertTimestampsToDates(value)])
        );
    }
    return data;
}

async function _read(collectionName: string, id?: { [key: string]: any }, single: boolean = true): Promise<_Collection | Object> {
    if (id) {
        let q = collection(db, collectionName);

        for (const [field, value] of Object.entries(id)) {
            q = query(q, where(field, "==", value)) as CollectionReference<DocumentData, DocumentData>;
        }

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            let docData;
            if (single) {
                docData = querySnapshot.docs[0].data() as Document;
            }
            else {
                const data = querySnapshot.docs.map((doc) => convertTimestampsToDates(doc.data()) as Document);
                return { [collectionName]: data } as _Collection;
            }
            
            return convertTimestampsToDates(docData);
        } else {
            return {};
        }

    } else {
        // If no id is provided, return all documents in the collection
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = querySnapshot.docs.map((doc) => convertTimestampsToDates(doc.data()) as Document);

        return { [collectionName]: data } as _Collection;
    }
}

// Delete document from firestore
import { deleteDoc } from "firebase/firestore";
async function _delete(collectionName: string, docId: string, customId?: string) {
    try {
        if (customId) {
            const q = query(collection(db, collectionName), where(customId, "==", docId));
            const querySnapshot = await getDocs(q);
            const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
        } else {
        await deleteDoc(doc(db, collectionName, docId));
        }
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

const writeData = fnWrapper(_write);
const updateData = fnWrapper(_update);
const readData = fnWrapper(_read);
const deleteData = fnWrapper(_delete);

export { writeData, updateData, readData, deleteData };