
const tableContainer = document.getElementById("video-table");
const lastUpdated = document.getElementById("last-updated");

async function fetchVideos() {
  try {
    const res = await fetch("/api/getVideos");
    const data = await res.json();
    renderTable(data.videos);
    updateTimestamp();
  } catch (error) {
    tableContainer.innerHTML = "<p>Failed to load videos.</p>";
  }
}

function renderTable(videos) {
  const rows = videos.map(video => {
    return `
      <tr class="video-row">
        <td>
          <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">
            <img src="${video.thumbnail}" width="120"/>
          </a>
        </td>
        <td>
          <a href="https://www.youtube.com/watch?v=${video.videoId}" target="_blank">${video.title}</a>
          <br />
          <button onclick="toggleSummary('${video.videoId}', this)">Show Summary</button>
          <div id="summary-${video.videoId}" class="summary-box" style="display:none;"></div>
        </td>
        <td>${video.publishedAt}</td>
        <td>${video.duration}</td>
        <td>${video.views}</td>
        <td>${video.likes}</td>
      </tr>`;
  }).join("");

  tableContainer.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Thumbnail</th>
          <th>Title</th>
          <th>Published</th>
          <th>Duration</th>
          <th>Views</th>
          <th>Likes</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function updateTimestamp() {
  const now = new Date();
  lastUpdated.textContent = "Last updated: " + now.toLocaleString();
}

async function toggleSummary(videoId, btn) {
  const box = document.getElementById("summary-" + videoId);
  if (box.style.display === "none") {
    box.innerHTML = "Loading summary...";
    box.style.display = "block";
    const res = await fetch("/api/summarizeTranscript?videoId=" + videoId);
    const data = await res.json();
    box.innerHTML = data.summary.replace(/\n/g, "<br>");
    btn.textContent = "Hide Summary";
  } else {
    box.style.display = "none";
    btn.textContent = "Show Summary";
  }
}

fetchVideos();
setInterval(fetchVideos, 10 * 60 * 1000); // Refresh every 10 mins
