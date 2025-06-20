const fetch = require("node-fetch");

module.exports = async function (context, req) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  const playlistUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
  const playlistRes = await fetch(playlistUrl);
  const playlistData = await playlistRes.json();
  const uploadsId = playlistData.items[0].contentDetails.relatedPlaylists.uploads;

  const videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${uploadsId}&key=${apiKey}`;
  const videosRes = await fetch(videosUrl);
  const videosData = await videosRes.json();

  const result = videosData.items.map(item => {
    const snippet = item.snippet;
    return {
      title: snippet.title,
      publishedAt: new Date(snippet.publishedAt).toLocaleString(),
      description: snippet.description,
      thumbnail: snippet.thumbnails?.default?.url || "",
      url: `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`
    };
  });

  context.res = {
    headers: { "Content-Type": "application/json" },
    body: result
  };
};
