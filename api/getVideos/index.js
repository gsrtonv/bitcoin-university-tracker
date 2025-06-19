module.exports = async function (context, req) {
  context.log("getVideos function started");
  context.res = {
    status: 200,
    body: {
      message: "Function is running",
      timestamp: new Date().toISOString()
    }
  };
};
