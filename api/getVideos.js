const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
  const endpoint = process.env.COSMOS_DB_ENDPOINT;
  const key = process.env.COSMOS_DB_KEY;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database("youtubeTrackerDB");
  const container = database.container("videos");

  try {
    const { resources: items } = await container.items.query("SELECT * FROM c").fetchAll();
    context.res = {
      status: 200,
      body: items
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: error.message }
    };
  }
};
