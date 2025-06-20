const { OpenAI } = require("openai");
const { getTranscript } = require("youtube-transcript");

module.exports = async function (context, req) {
  const videoId = req.query.videoId;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!videoId || !openaiKey) {
    context.res = {
      status: 400,
      body: { error: "Missing videoId or OpenAI key" }
    };
    return;
  }

  try {
    const transcriptResponse = await getTranscript(videoId);
    const transcript = transcriptResponse.map(entry => entry.text).join(" ");

    const openai = new OpenAI({ apiKey: openaiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a YouTube summarization assistant. Provide a short summary and 3-5 key takeaways."
        },
        {
          role: "user",
          content: `Transcript:\n${transcript}`
        }
      ]
    });

    const answer = completion.choices[0].message.content;

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { summary: answer }
    };
  } catch (err) {
    context.log("Error:", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to summarize transcript." }
    };
  }
};