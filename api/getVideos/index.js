const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    const endpoint = process.env.COSMOS_DB_ENDPOINT;
    const key = process.env.COSMOS_DB_KEY;
    const client = new CosmosClient({ endpoint, key });

    const database = client.database("youtubeTrackerDB");
    const container = database.container("videos");

    const querySpec = {
        query: "SELECT * FROM c ORDER BY c.publishedAt DESC"
    };

    const { resources: items } = await container.items.query(querySpec).fetchAll();

    context.res = {
        status: 200,
        body: items,
        headers: {
            "Content-Type": "application/json"
        }
    };
};
