import ollama from 'ollama'

async function listModels() {
    const models = await ollama.list();
    console.log(models);
}

//listModels();

const response = await ollama.chat({
    model: "hf.co/Bllossom/llama-3.2-Korean-Bllossom-3B-gguf-Q4_K_M",
    messages: [
        { role: 'system', content: '내가 프로그래머라고 생각하고 대답해' },
        { role: 'user', content: 'c++로 헬로월드 출력하는 프로그램 작성해봐.' }
    ],
    stream: true,
})

for await (const part of response) {
    process.stdout.write(part.message.content);
}