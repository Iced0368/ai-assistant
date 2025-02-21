import { defineStore } from 'pinia';
import { ChatSession } from '../../models';
import { addMessageIndexedDB, addSessionIndexedDB, openDB, renameSessionIndexedDB } from '../../db/dababase';
import { converIDBDataToSession, convertSessionToIDBData } from '../../models/ChatSession';
import type { ChatResponse } from 'ollama';

export const useDataStore = defineStore("dataStore", {
    state: () => ({
        db: null as IDBDatabase | null,
        sessions: [] as ChatSession[],
        selectedSession: undefined as ChatSession | undefined,
    }),

    actions: {
        async loadSessions() {
            const db = await openDB();
            const transaction = db.transaction("sessions", "readonly");
            const store = transaction.objectStore("sessions");
            const request = store.getAll();

            this.db = db;
          
            request.onsuccess = () => {
                if (request.result.length > 0) {
                    this.sessions = request.result.map(sessionData => converIDBDataToSession(sessionData));
                    this.selectedSession = this.sessions[0]; // 첫 번째 세션 선택
                } 
                else {
                    // 저장된 세션이 없을 경우 기본 세션 추가
                    const defaultSession = new ChatSession("새 대화");
                    const addTransaction = db.transaction("sessions", "readwrite");
                    const addStore = addTransaction.objectStore("sessions");
                    addStore.add(convertSessionToIDBData(defaultSession));
                
                    this.sessions = [defaultSession];
                    this.selectedSession = defaultSession;
                }
            };
          
            request.onerror = () => {
                console.error("Failed to load sessions from IndexedDB");
            };
        },

        createSession() {
            const newSession = new ChatSession("새 대화");
            this.sessions.push(newSession);
            this.selectedSession = newSession;

            addSessionIndexedDB(this.db!, newSession);
        },

        renameSession(session: ChatSession, name: string) {
            session.name = name;
            renameSessionIndexedDB(this.db!, session, name);
        },

        selectSession(sessionId: string) {
            this.selectedSession = this.sessions.find(session => session.id === sessionId)!;
        },
        
        async chatToSession(session: ChatSession, text: string, onStream: (chatResponse: ChatResponse)=> void) {
            const {userMessage, assistantMessage} = await session.chat(text, onStream);
            
            await addMessageIndexedDB(this.db!, session, userMessage);
            await addMessageIndexedDB(this.db!, session, assistantMessage);
        }
    }
})