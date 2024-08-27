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

async function _write(collection_name: string, contents: any, doc_id: string = uuidv4()): Promise<void> {
    const docRef = doc(collection(db, collection_name), doc_id);
    await setDoc(docRef, contents);
}

// Generic update id in firestore that may or may not exist
import { updateDoc } from "firebase/firestore";
async function _update(collection_name: string, contents: any, doc_id: string) {
    const docRef = doc(collection(db, collection_name), doc_id);
    await updateDoc(docRef, contents);
}

// Generic read entire collection
import { getDocs, query, where, CollectionReference, DocumentData } from "firebase/firestore";
import { Collection as _Collection, Document } from "../app/interfaces";
async function _read(collection_name: string, id?: { [key: string]: any }): Promise<_Collection | Object> {
    if (id) {
        let q = collection(db, collection_name);

        for (const [field, value] of Object.entries(id)) {
            q = query(q, where(field, "==", value)) as CollectionReference<DocumentData, DocumentData>;
        }

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data() as Document;
        }
        else {
            return {}
        }

    } else {
        // If no id is provided, return all documents in the collection
        const querySnapshot = await getDocs(collection(db, collection_name));
        const data = querySnapshot.docs.map((doc) => doc.data() as Document);

        return { [collection_name]: data } as _Collection;
    }
}

// Delete document from firestore
import { deleteDoc } from "firebase/firestore";
async function _delete(collection_name: string, doc_id: string) {
    try {
        await deleteDoc(doc(db, collection_name, doc_id));
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

const writeData = fnWrapper(_write);
const updateData = fnWrapper(_update);
const readData = fnWrapper(_read);
const deleteData = fnWrapper(_delete);

export { writeData, updateData, readData, deleteData };