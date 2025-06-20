const tableBody = document.querySelector("#videoTable tbody");

function createRow(video) {
  const row = document.createElement("tr");

  const thumb = document.createElement("td");
  const img = document.createElement("img");
  img.src = video.thumbnail;
  img.style.width = "120px";
  thumb.appendChild(img);

  const title = document.createElement("td");
  const link = document.createElement("a");
  link.href = `https://www.youtube.com/watch?v=${video.videoId}`;
  link.target = "_blank";
  link.textContent = video.title;
  title.appendChild(link);

  const date = document.createElement("td");
  date.textContent = new Date(video.publishedAt).toLocaleDateString();

  const summaryCell = document.createElement("td");
  const button = document.createElement("button");
  button.textContent = "Show Summary";
  const content = document.createElement("div");
  content.className = "accordion-content";

  button.addEventListener("click", async () => {
    if (content.textContent === "") {
      content.textContent = "Loading...";
      const res = await fetch(`/api/summarizeTranscript?videoId=${video.videoId}`);
      const data = await res.json();
      content.textContent = data.summary || "No summary available.";
    }
    content.classList.toggle("active");
  });

  summaryCell.appendChild(button);
  summaryCell.appendChild(content);

  row.appendChild(thumb);
  row.appendChild(title);
  row.appendChild(date);
  row.appendChild(summaryCell);

  return row;
}

async function loadVideos() {
  try {
    const res = await fetch("/api/getVideos");
    const data = await res.json();
    tableBody.innerHTML = "";
    data.forEach(video => {
      tableBody.appendChild(createRow(video));
    });
  } catch (e) {
    tableBody.innerHTML = "<tr><td colspan='4'>Failed to load videos</td></tr>";
  }
}

loadVideos();
setInterval(loadVideos, 10 * 60 * 1000); // every 10 minutes
