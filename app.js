
async function getLatestVideos() {
  try {
    const response = await fetch("/api/getVideos");
    const videos = await response.json();

    const tbody = document.querySelector("#video-table tbody");
    tbody.innerHTML = "";

    videos.forEach((item, index) => {
      const { title, thumbnails, publishedAt, description, resourceId } = item.snippet;
      const videoId = resourceId.videoId;

      const mainRow = document.createElement("tr");
      mainRow.classList.add("video-row");
      mainRow.style.cursor = "pointer";
      mainRow.onclick = () => {
        const details = document.getElementById(`details-${index}`);
        details.style.display = details.style.display === "table-row" ? "none" : "table-row";
      };

      mainRow.innerHTML = `
        <td><a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
              <img class="thumbnail" src="${thumbnails.default.url}" /></a></td>
        <td><a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">${title}</a></td>
        <td>${new Date(publishedAt).toLocaleString()}</td>
      `;

      const detailsRow = document.createElement("tr");
      detailsRow.classList.add("details");
      detailsRow.id = `details-${index}`;
      detailsRow.innerHTML = `
        <td colspan="3">
          <div>${marked.parse(description || "No description available.")}</div>
        </td>
      `;

      tbody.appendChild(mainRow);
      tbody.appendChild(detailsRow);
    });

    document.getElementById("last-updated").textContent =
      "Last updated: " + new Date().toLocaleString();
  } catch (err) {
    console.error(err);
  }
}
getLatestVideos();
setInterval(getLatestVideos, 600000);
