function convertDuration(iso) {
  const matches = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const h = matches[1] ? matches[1].replace('H', '').padStart(2, '0') : '00';
  const m = matches[2] ? matches[2].replace('M', '').padStart(2, '0') : '00';
  const s = matches[3] ? matches[3].replace('S', '').padStart(2, '0') : '00';
  return `${h}:${m}:${s}`;
}

async function getLatestVideos() {
  try {
    const response = await fetch("/api/getVideos");
    const data = await response.json();
    const tableBody = document.querySelector("#videos-table tbody");
    tableBody.innerHTML = "";

    data.items.forEach(item => {
      const snippet = item.snippet;
      const videoId = snippet.resourceId.videoId || snippet.videoId;
      const thumbnail = snippet.thumbnails.medium.url;
      const title = snippet.title;
      const publishedAt = new Date(snippet.publishedAt).toLocaleString();
      const description = snippet.description.slice(0, 80) + "...";
      const duration = item.duration ? convertDuration(item.duration) : "N/A";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${thumbnail}" alt="Thumbnail"></td>
        <td>${title}</td>
        <td>${publishedAt}</td>
        <td>${description}</td>
        <td>${duration}</td>
        <td>N/A</td>
        <td>N/A</td>
        <td><a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">Watch</a></td>
      `;
      tableBody.appendChild(row);

      const thumbnailCell = row.querySelector("td img");

      thumbnailCell.addEventListener("mouseenter", e => {
        const preview = document.getElementById("hover-preview");
        const iframe = preview.querySelector("iframe");
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
        preview.style.left = e.pageX + 20 + "px";
        preview.style.top = e.pageY + "px";
        preview.style.display = "block";
      });

      thumbnailCell.addEventListener("mousemove", e => {
        const preview = document.getElementById("hover-preview");
        preview.style.left = e.pageX + 20 + "px";
        preview.style.top = e.pageY + "px";
      });

      thumbnailCell.addEventListener("mouseleave", () => {
        const preview = document.getElementById("hover-preview");
        const iframe = preview.querySelector("iframe");
        iframe.src = "";
        preview.style.display = "none";
      });
    });

    document.getElementById("last-updated").textContent =
      "Last updated: " + new Date().toLocaleString();

  } catch (error) {
    console.error("Error loading videos:", error);
    document.querySelector("#videos-table tbody").innerHTML = `
      <tr><td colspan="8">Failed to load videos. Check the server logs.</td></tr>
    `;
  }
}

getLatestVideos();
setInterval(getLatestVideos, 10 * 60 * 1000);
