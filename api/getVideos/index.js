module.exports = async function (context, req) {
    context.res = {
        body: { message: "Sample response from getVideos function" }
    };
};