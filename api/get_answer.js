const express = require('express');
const OpenAI = require('openai');

const openai = new OpenAI();

const app = express();
app.use(express.json());

app.post('/answer', async (req, res) => {
	const { scraped_content, query } = req.body;

	if (!scraped_content || !query) {
		res.status(400).json({ error: 'Missing "scraped_content" or "query" parameter' });
		return;
	}

	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			response_format: { "type": "json_object" },
			messages: [
				{
					role: "user",
					content: `Answer this question: """${query}""", base your answer from this scraped content: """${scraped_content}""". Return the answer in JSON format, like this: {"answer": "your answer here"}`
				}
			],
		});

		const message = response.choices[0].message.content;
		res.json(JSON.parse(message));
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
