import Groq from "groq-sdk";
import 'dotenv/config'

const groq = new Groq();

export async function groqResponse(query) {
    const stream = await getGroqChatStream(query);
    for await (const chunk of stream) {
        // Print the completion returned by the LLM.
        console.log(chunk.choices[0]?.delta?.content || "");
    }
}

export async function getGroqChatStream(query) {
    return groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: "you are a helpful assistant.",
            },
            {
                role: "user",
                content:
                    query,
            },
        ],
        model: "llama3-8b-8192",
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
    });
}