import type { Message } from "ollama";
import { DB_NAME, DB_VERSION } from "../metadata";
import type { ChatSession } from "../models";

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
        const db = request.result;

        if (!db.objectStoreNames.contains("sessions")) {
            const store = db.createObjectStore("sessions", { keyPath: "id", autoIncrement: true });
            store.createIndex("by_id", "id"); 
        }
        };

        request.onerror = (event) => {
            reject("IndexedDB opening failed: " + event);
        };

        request.onsuccess = (event) => {
            resolve(request.result);
        };
    });
};

const addMessageToIndexedDB = (db: IDBDatabase, sessionID: string, message: Message & {id: number}) => {
    const transaction = db.transaction("sessions", "readwrite");
    const objectStore = transaction.objectStore("sessions");
    const getSessionRequest = objectStore.get(sessionID);

    getSessionRequest.onsuccess = (event) => {
        const session = getSessionRequest.result as ChatSession;
    }
}


  