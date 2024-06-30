const express = require('express');
const OpenAI = require('openai');

const openai = new OpenAI();

const app = express();
app.use(express.json()); // for parsing application/json

app.post('/analyze', async (req, res) => {
	const { auth_token, sources, query } = req.body;

	if (!sources || !query) {
		res.status(400).json({ error: 'Missing sources or query parameter' });
		return;
	}

	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			response_format: { "type": "json_object" },
			messages: [
				{
					role: "user",
					content: `Pick 3 urls from these sources: """${JSON.stringify(sources)}""" that we will scrape to get the answer to this query: """${query}""". Return in JSON format like this: { "urls": ["url1", "url2", "url3"] }`
				}
			],
		});

		// remomve new line characters
		message = response.choices[0].message.content.replace(/\r?\n|\r/g, '');

		res.json(JSON.parse(message));
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
