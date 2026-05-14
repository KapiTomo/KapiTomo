const works = window.KAPI_TOMO_WORKS || [];

const worksGrid = document.querySelector("#worksGrid");
const latestList = document.querySelector("#latestList");
const downloadsList = document.querySelector("#downloadsList");
const searchInput = document.querySelector("#searchInput");
const filters = [...document.querySelectorAll(".filter")];
const readerDialog = document.querySelector("#readerDialog");
const readerTitle = document.querySelector("#readerTitle");
const readerMeta = document.querySelector("#readerMeta");
const readerPages = document.querySelector("#readerPages");
const chapterTabs = document.querySelector("#chapterTabs");
const closeReader = document.querySelector("#closeReader");

let activeFilter = "All";
let query = "";

function matchesWork(work) {
  const searchable = `${work.title} ${work.genre} ${work.status} ${work.description}`.toLowerCase();
  const genreMatch = activeFilter === "All" || work.genre === activeFilter;
  return genreMatch && searchable.includes(query.toLowerCase());
}

function renderWorks() {
  const visibleWorks = works.filter(matchesWork);
  worksGrid.innerHTML = "";

  if (!visibleWorks.length) {
    worksGrid.innerHTML = '<p class="empty-state">No works found.</p>';
    return;
  }

  visibleWorks.forEach((work) => {
    const card = document.createElement("article");
    card.className = "work-card";
    card.innerHTML = `
      <img src="${work.cover}" alt="${work.title} cover" loading="lazy">
      <div class="work-card-body">
        <div class="work-tags">
          <span>${work.genre}</span>
          <span>${work.status}</span>
          <span>${work.rating}</span>
        </div>
        <h3>${work.title}</h3>
        <p>${work.description}</p>
        <div class="card-actions">
          <button class="button primary small" type="button" data-read="${work.id}">Read</button>
          <a class="button secondary small" href="${work.download}" download>Download</a>
        </div>
      </div>
    `;
    worksGrid.appendChild(card);
  });
}

function renderLatest() {
  const latest = works
    .flatMap((work) =>
      work.chapters.map((chapter) => ({
        work,
        chapter
      }))
    )
    .slice(0, 6);

  latestList.innerHTML = latest
    .map(
      ({ work, chapter }) => `
        <article class="latest-item">
          <img src="${work.cover}" alt="" loading="lazy">
          <div>
            <span>${work.title}</span>
            <h3>${chapter.title}</h3>
            <p>${chapter.date}</p>
          </div>
          <button class="button secondary small" type="button" data-read="${work.id}">Read</button>
        </article>
      `
    )
    .join("");
}

function renderDownloads() {
  downloadsList.innerHTML = works
    .map(
      (work) => `
        <a class="download-item" href="${work.download}" download>
          <span>${work.title}</span>
          <strong>${work.genre}</strong>
        </a>
      `
    )
    .join("");
}

function renderChapter(work, chapterIndex = 0) {
  const chapter = work.chapters[chapterIndex];
  readerTitle.textContent = work.title;
  readerMeta.textContent = `${work.genre} / ${chapter.title}`;

  chapterTabs.innerHTML = work.chapters
    .map(
      (item, index) => `
        <button
          class="${index === chapterIndex ? "active" : ""}"
          type="button"
          data-chapter="${index}"
        >${item.title.replace("Chapter ", "Ch. ")}</button>
      `
    )
    .join("");

  readerPages.innerHTML = chapter.pages
    .map((page, index) => `<section class="reader-page"><span>${index + 1}</span><p>${page}</p></section>`)
    .join("");

  chapterTabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => renderChapter(work, Number(button.dataset.chapter)));
  });
}

function openReader(workId) {
  const work = works.find((item) => item.id === workId);
  if (!work) return;

  renderChapter(work);
  readerDialog.showModal();
}

document.body.addEventListener("click", (event) => {
  const readButton = event.target.closest("[data-read]");
  if (readButton) {
    openReader(readButton.dataset.read);
  }
});

searchInput.addEventListener("input", (event) => {
  query = event.target.value.trim();
  renderWorks();
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderWorks();
  });
});

closeReader.addEventListener("click", () => readerDialog.close());

readerDialog.addEventListener("click", (event) => {
  if (event.target === readerDialog) {
    readerDialog.close();
  }
});

renderWorks();
renderLatest();
renderDownloads();
