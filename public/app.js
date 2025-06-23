console.log('App initialized');

async function loadVideos() {
    try {
        const res = await fetch('/api/getVideos');
        const data = await res.json();

        const container = document.getElementById('videos');
        container.innerHTML = ''; // clear "Loading..."

        if (data.length === 0) {
            container.innerText = 'No videos found.';
            return;
        }

        data.forEach(video => {
            const div = document.createElement('div');
            div.className = 'video-card';
            div.innerHTML = `
                <h3>${video.title}</h3>
                <p><strong>Views:</strong> ${video.views}</p>
                <p><strong>Likes:</strong> ${video.likes}</p>
                <p><strong>Duration:</strong> ${video.duration}</p>
                <a href="${video.url}" target="_blank">Watch Video</a>
                <hr>
            `;
            container.appendChild(div);
        });
    } catch (err) {
        console.error('Error loading videos:', err);
        document.getElementById('videos').innerText = 'Failed to load videos.';
    }
}

loadVideos();
