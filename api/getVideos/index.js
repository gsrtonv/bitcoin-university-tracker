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

    // Step 1: Get uploads playlist ID
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelRes.json();

    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    if (!uploadsPlaylistId) {
      context.res = {
        status: 500,
        body: "Could not retrieve uploads playlist ID"
      };
      return;
    }

    // Step 2: Get video list
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}`
    );
    const playlistData = await playlistRes.json();

    const videoIds = playlistData.items.map(item => item.snippet.resourceId.videoId).join(',');

    // Step 3: Get durations
    const videoDetailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    const videoDetails = await videoDetailsRes.json();

    playlistData.items.forEach((item, idx) => {
      item.duration = videoDetails.items[idx]?.contentDetails?.duration || "N/A";
    });

    context.res = {
      status: 200,
      body: playlistData
    };

  } catch (error) {
    context.res = {
      status: 500,
      body: "Server error: " + error.message
    };
  }
};
