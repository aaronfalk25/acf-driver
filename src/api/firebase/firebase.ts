import { v4 as uuidv4 } from 'uuid';
import { app } from '@/context/AuthContext';

// Generic write to firestore
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
const db = getFirestore(app);

function fnWrapper(fn: Function) {
    return async function(...args: any) {
        try {
            await fn(...args);
            return {
                success: true,
                error: null
            }
        } catch (e) {
            return {
                success: false,
                error: e
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
import { getDocs } from "firebase/firestore";
import { Collection as _Collection, Document } from "../../app/interfaces";
async function _read(collection_name: string): Promise<_Collection> {
    const querySnapshot = await getDocs(collection(db, collection_name));

    // Create a colleciton that will be returned that holds every document
    const resCollection: _Collection = {
        name: collection_name,
        documents: []
    }

    // Loop through each document and add it to the collection
    querySnapshot.forEach((doc) => {
        const document: Document = {
            id: doc.id,
            ...doc.data() 
        }
        resCollection.documents.push(document);
    });

    return resCollection;
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

const write_data = fnWrapper(_write);
const update_data = fnWrapper(_update);
const read_data = fnWrapper(_read);
const delete_data = fnWrapper(_delete);

export { write_data, update_data, read_data, delete_data };