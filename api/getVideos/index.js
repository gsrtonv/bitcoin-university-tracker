const fetch = require("node-fetch");

module.exports = async function (context, req) {
  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
      context.res = {
        status: 500,
        body: "Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID"
      };
      return;
    }

    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelRes.json();

    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      context.res = { status: 500, body: "Failed to retrieve uploads playlist ID" };
      return;
    }

    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}`
    );
    const playlistData = await playlistRes.json();

    const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId).join(',');

    const videoStatsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    const videoStatsData = await videoStatsRes.json();

    playlistData.items.forEach((item, idx) => {
      item.duration = videoStatsData.items[idx]?.contentDetails?.duration || "N/A";
    });

    context.res = { status: 200, body: playlistData };

  } catch (error) {
    context.res = {
      status: 500,
      body: "Server error: " + error.message
    };
  }
};
