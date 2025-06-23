const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const endpoint = process.env.COSMOS_DB_ENDPOINT;
    const key = process.env.COSMOS_DB_KEY;
    const databaseId = "youtubeTrackerDB";
    const containerId = "videos";

    const client = new CosmosClient({ endpoint, key });

    try {
        const container = client.database(databaseId).container(containerId);
        const { resources: items } = await container.items.query("SELECT * FROM c ORDER BY c.publishedAt DESC").fetchAll();
        context.res = {
            status: 200,
            body: items
        };
    } catch (err) {
        context.log.error("Failed to fetch videos:", err);
        context.res = {
            status: 500,
            body: { error: "Failed to fetch videos." }
        };
    }
};