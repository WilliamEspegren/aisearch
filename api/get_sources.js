import { Spider } from '@spider-cloud/spider-client';

const spider = new Spider();

export async function spiderSearch(query) {
	const options = {
		"fetch_page_content": false,
		"num": 10,
	}
	try {
		const response = await spider.search(query, options);
		return response;
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
}