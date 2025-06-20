
const fetch = require("node-fetch");

module.exports = async function (context, req) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const uploadsPlaylistId = process.env.UPLOADS_PLAYLIST_ID;

  let allVideos = [];
  let nextPageToken = "";

  try {
    do {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${apiKey}&pageToken=${nextPageToken}`
      );
      const data = await res.json();
      allVideos.push(...data.items);
      nextPageToken = data.nextPageToken || "";
    } while (nextPageToken);

    context.res = {
      status: 200,
      body: allVideos
    };
  } catch (err) {
    context.log.error("Error fetching YouTube data:", err);
    context.res = {
      status: 500,
      body: { error: "Failed to fetch video data." }
    };
  }
};
