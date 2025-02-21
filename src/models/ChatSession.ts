import ollama, { type ChatResponse, type Message } from "ollama";
import AsyncLock from "async-lock";
import { v4 as uuidv4 } from "uuid";

type SessionMessage = Message & { id: number };

export type ChatConfig = {
    model: string,
    memory: number,
    prompt: string,
}

const defaultConfig = {
    model: "hf.co/Bllossom/llama-3.2-Korean-Bllossom-3B-gguf-Q4_K_M",
    memory: 100,
    prompt: "",
}

export type ChatSessionIDBData = {
    id: string;
    name: string;
    messages: SessionMessage[];
    messageID: number;
    config: ChatConfig;
};

export class ChatSession {
    id: string;
    name: string;
    messages: SessionMessage[];
    config: ChatConfig;

    messageID: number;
    lock: AsyncLock;

    constructor(sessionName: string) {
        this.id = uuidv4();
        this.name = sessionName;
        this.messages = [];

        this.config = {...defaultConfig};
        this.messageID = 0;
        this.lock = new AsyncLock();
    }

    chat(text: string, onStream?: (chatResponse: ChatResponse) => void) {
        return this.lock.acquire("chat-lock", async () => {
            const userMessage = { 
                role: "user", 
                content: text, 
                id: ++this.messageID,
            };

            this.messages.push(userMessage);

            const assistantMessage = {
                role: "assistant",
                content: "",
                id: ++this.messageID,
            }

            const index = this.messages.push(assistantMessage) - 1;

            const response = await ollama.chat({
                model: this.config.model,
                messages: [
                    { role: "system", content: this.config.prompt },
                    ...this.messages.slice(Math.max(0, this.messages.length - this.config.memory)),
                ],
                stream: true,
            });

            for await (const chunk of response as AsyncIterable<ChatResponse>) {
                this.messages[index].content += chunk.message.content;
                onStream && onStream(chunk);
            }

            return {userMessage, assistantMessage};
        });
    }
}

export const convertSessionToIDBData = (session: ChatSession) => {
    return {
        id: session.id,
        name: session.name,
        messages: session.messages,
        config: session.config,
        messageID: session.messageID,
    }
}

export const converIDBDataToSession = (data: ChatSessionIDBData) => {
    const session = new ChatSession(data.name);
    session.id = data.id;
    session.name = data.name;
    session.messages = data.messages;
    session.messageID = data.messageID;
    session.config = data.config;

    return session;
}