import type { Message } from "ollama";
import { type ChatSession, type ChatSessionIDBData } from "../models";
import { convertSessionToIDBData } from "../models/ChatSession";
const DB_VERSION = 1;
const DB_NAME = "AI-Assistant-DB";
const STORE_NAME = "sessions";

export const openDB = async (): Promise<IDBDatabase> => {
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  
    dbRequest.onupgradeneeded = (event) => {
        const db = (event.target as IDBRequest).result;

        // 세션을 저장할 object store를 생성합니다.
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
            //store.createIndex("name", "name", { unique: false });
        }
    };
  
    return new Promise((resolve, reject) => {
        dbRequest.onsuccess = (event) => resolve((event.target as IDBRequest).result);
        dbRequest.onerror = (event) => reject((event.target as IDBRequest).error);
    });
};

export const addMessageIndexedDB = async (db: IDBDatabase, session: ChatSession, message: Message & { id: number }) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const getRequest = store.get(session.id);

    getRequest.onsuccess = (event) => {
        const sessionData = getRequest.result as ChatSessionIDBData;

        if (sessionData) {
            // 메시지 추가
            sessionData.messages.push(message);
            sessionData.messageID = session.messageID;
            store.put(sessionData);  // 세션을 갱신
        } 
        else {
            console.error("Session not found");
        }
    };

    getRequest.onerror = () => {
        console.error("Failed to retrieve session");
    };
};

export const addSessionIndexedDB = async (db: IDBDatabase, session: ChatSession) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const addRequest = store.add(convertSessionToIDBData(session));

    addRequest.onsuccess = () => {
        console.log(`Session ${session.id} added to IndexedDB.`);
    };

    addRequest.onerror = () => {
        console.error(`Failed to add session ${session.id} to IndexedDB.`);
    };
};

export const renameSessionIndexedDB = async (db: IDBDatabase, session: ChatSession, name: string) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const getRequest = store.get(session.id);

    getRequest.onsuccess = (event) => {
        const sessionData = getRequest.result as ChatSession;

        if (sessionData) {
            // 메시지 추가
            sessionData.name = name;
            store.put(sessionData);  // 세션을 갱신
        } 
        else {
            console.error("Session not found");
        }
    };

    getRequest.onerror = () => {
        console.error("Failed to retrieve session");
    };
};