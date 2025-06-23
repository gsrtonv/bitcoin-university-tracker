console.log('App initialized');
async function loadVideos() {
    try {
        const response = await fetch('/api/getVideos');
        const videos = await response.json();
        const container = document.getElementById('videos');
        container.innerHTML = '';
        videos.forEach(video => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${video.title}</strong> - ${video.publishedAt}`;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}
loadVideos();