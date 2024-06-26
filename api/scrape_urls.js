const express = require('express');
const { Spider } = require('@spider-cloud/spider-client');

const spider = new Spider();

const app = express();
app.use(express.json()); // for parsing application/json

app.post('/scrape', async (req, res) => {
	const { urls } = req.body;
	const params = { "return_format": "markdown", "readability": true };

	if (!urls) {
		return res.status(400).json({ error: 'URLs parameter is required' });
	}

	try {
		// Create an array of promises
		const scrapePromises = urls.map(url => spider.scrapeUrl(url, params));

		// Wait for all promises to resolve
		const responses = await Promise.all(scrapePromises);

		// Map responses to include only content and url
		const result = responses.map(response => ({
			content: response[0].content,
			url: response[0].url
		}));

		res.json(result);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
