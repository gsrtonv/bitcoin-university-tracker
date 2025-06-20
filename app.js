
document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "/api/getVideos";
  const tableContainer = document.getElementById("video-table");
  const lastUpdated = document.getElementById("last-updated");

  function formatDate(iso) {
    const date = new Date(iso);
    return date.toLocaleString();
  }

  function toggleAccordion(e) {
    const content = e.currentTarget.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
  }

  function renderTable(videos) {
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Thumbnail</th>
          <th>Title</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${videos.map(video => `
          <tr class="accordion-header">
            <td><a href="https://www.youtube.com/watch?v=${video.id}" target="_blank"><img src="${video.thumbnail}" width="120"/></a></td>
            <td><a href="https://www.youtube.com/watch?v=${video.id}" target="_blank">${video.title}</a></td>
            <td>${formatDate(video.publishedAt)}</td>
          </tr>
          <tr class="accordion-content">
            <td colspan="3">${video.description}</td>
          </tr>
        `).join("")}
      </tbody>
    `;
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);

    document.querySelectorAll(".accordion-header").forEach(row => {
      row.addEventListener("click", toggleAccordion);
    });
  }

  function fetchData() {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        renderTable(data.videos || []);
        lastUpdated.textContent = "Last updated: " + new Date().toLocaleTimeString();
      })
      .catch(err => {
        tableContainer.textContent = "Error loading videos.";
        console.error(err);
      });
  }

  fetchData();
  setInterval(fetchData, 10 * 60 * 1000); // every 10 min
});
