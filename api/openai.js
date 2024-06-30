import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI();

export async function* openaiResponse(query) {
    const stream = await getOpenAiChatStream(query);
    for await (const chunk of stream) {
        yield chunk.choices[0]?.delta?.content || "";
    }
}

export async function getOpenAiChatStream(query) {
    return openai.chat.completions.create({
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
        model: "gpt-3.5-turbo",
        temperature: 0.5,
        max_tokens: 1024,
        top_p: 1,
        stream: true,
    });
}