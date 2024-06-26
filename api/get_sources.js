const express = require('express');
const { Spider } = require('@spider-cloud/spider-client');

const app = express();
const spider = new Spider();

app.get('/search', async (req, res) => {
	// Start timer
	const start = Date.now();

	const query = req.query.q;

	if (!req.query.q) {
		return res.status(400).json({ error: 'Query parameter is required' });
	}
	const options = {
		"fetch_page_content": false,
		"num": 20,
	}
	try {
		const response = await spider.search(query, options);
		// Stop timer
		const end = Date.now();
		console.log(end - start);
		return res.json(response);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
