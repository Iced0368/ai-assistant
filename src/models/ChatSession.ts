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

    async chat(text: string, onStream?: (chatResponse: ChatResponse) => void) {
        let index = 0;
        this.lock.acquire("chat-lock", async () => {
            this.messages.push({ 
                role: "user", 
                content: text, 
                id: ++this.messageID,
            });

            index = this.messages.push(
                {
                    role: "assistant",
                    content: "",
                    id: ++this.messageID,
                }
            ) - 1;
        });

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
    }
}