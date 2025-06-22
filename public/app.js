
async function fetchVideos() {
    const res = await fetch('/api/getVideos');
    const data = await res.json();
    const container = document.getElementById('videos');
    container.innerHTML = '';
    data.forEach(video => {
        const div = document.createElement('div');
        div.innerHTML = `<h2>${video.title}</h2><p>${video.summary}</p>`;
        container.appendChild(div);
    });
}
fetchVideos();
