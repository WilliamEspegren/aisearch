import { groqResponse } from "./groq.js";
import { openaiResponse } from "./openai.js";

const MODELS = ['groq', 'openai']

export async function getAnswer(scraped_content, query, model = 'groq') {
	if (!scraped_content || !query) {
		const errorMessage = { error: 'Missing "scraped_content" or "query" parameter' };
		return errorMessage;
	}

	// check if model is valid
	if (!MODELS.includes(model)) {
		const errorMessage = { error: `Invalid model "${model}"` };
		console.error(errorMessage);
		return errorMessage;
	}

	try {
		const promptQuery = `Answer this question: """${query}""", base your answer from this scraped content: """${scraped_content}""". Return the answer in JSON format, like this: {"answer": "your answer here"}`
		if (model === 'groq') {
			const response = await groqResponse(promptQuery);
			console.log(response);
			return response;
		}
		if (model === 'openai') {
			const response = await openaiResponse(promptQuery);
			return response;
		}
	} catch (error) {
		console.error('Error:', error);
		const errorMessage = { error: "Internal server error" };
		return errorMessage;
	}
};