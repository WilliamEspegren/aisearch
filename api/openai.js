import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI();

export async function main() {
  const stream = await getOpenAiChatStream();
  for await (const chunk of stream) {
    // Print the completion returned by the LLM.
    console.log(chunk.choices[0]?.delta?.content || "");
  }
}

export async function getOpenAiChatStream() {
  return openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "you are a helpful assistant.",
      },
      {
        role: "user",
        content:
          "Write a 500 word essay about Monaco",
      },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    max_tokens: 1024,
    top_p: 1,
    stream: true,
  });
}