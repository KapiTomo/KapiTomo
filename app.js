const works = window.KAPI_TOMO_WORKS || [];

const worksGrid = document.querySelector("#worksGrid");
const searchInput = document.querySelector("#searchInput");
const filters = [...document.querySelectorAll(".filter")];
const homeSections = [...document.querySelectorAll("main > section:not(.route-view)")];
const routeViews = [...document.querySelectorAll(".route-view")];
const workView = document.querySelector("#workView");
const chapterView = document.querySelector("#chapterView");
const workTemplate = document.querySelector("#workTemplate");
const chapterTemplate = document.querySelector("#chapterTemplate");

let activeFilter = "All";
let query = new URLSearchParams(window.location.search).get("q") || "";

function getWork(workId) {
  return works.find((item) => item.id === workId);
}

function showHome() {
  homeSections.forEach((section) => section.classList.remove("hidden"));
  routeViews.forEach((section) => section.classList.add("hidden"));
  workView.innerHTML = "";
  chapterView.innerHTML = "";
}

function showRoute(view) {
  homeSections.forEach((section) => section.classList.add("hidden"));
  routeViews.forEach((section) => section.classList.add("hidden"));
  view.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "auto" });
}

function matchesWork(work) {
  const searchable = `${work.title} ${work.genre} ${work.status} ${work.description}`.toLowerCase();
  const genreMatch = activeFilter === "All" || work.genre === activeFilter;
  return genreMatch && searchable.includes(query.toLowerCase());
}

function chapterUrl(work, chapterIndex = 0) {
  return `#ler/${work.id}/${chapterIndex}`;
}

function workUrl(work) {
  return `#obra/${work.id}`;
}

function getChapterParagraphs(chapter) {
  if (Array.isArray(chapter.paragraphs) && chapter.paragraphs.length) {
    return chapter.paragraphs;
  }

  return Array.isArray(chapter.pages) ? chapter.pages : [];
}

function getWordCount(textItems) {
  return textItems
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function getReadingMinutes(wordCount) {
  return Math.max(1, Math.ceil(wordCount / 180));
}

function renderWorks() {
  const visibleWorks = works.filter(matchesWork);
  worksGrid.innerHTML = "";

  if (!visibleWorks.length) {
    worksGrid.innerHTML = '<p class="empty-state">Nenhuma obra encontrada.</p>';
    return;
  }

  visibleWorks.forEach((work) => {
    const card = document.createElement("article");
    card.className = "work-card";
    card.innerHTML = `
      <a class="work-cover-link" href="${workUrl(work)}" aria-label="Abrir ${work.title}">
        <img src="${work.cover}" alt="Capa de ${work.title}" loading="lazy">
        <span class="work-cover-badge">${work.genre}</span>
      </a>
      <div class="work-card-body">
        <h3><a href="${workUrl(work)}">${work.title}</a></h3>
        <p>${work.chapters.length} capitulo${work.chapters.length === 1 ? "" : "s"} pronto</p>
      </div>
    `;
    worksGrid.appendChild(card);
  });
}

function renderWorkPage(work) {
  const fragment = workTemplate.content.cloneNode(true);
  const page = fragment.querySelector(".manga-page");

  fragment.querySelector(".manga-cover").src = work.cover;
  fragment.querySelector(".manga-cover").alt = `Capa de ${work.title}`;
  fragment.querySelector(".manga-genre").textContent = work.genre;
  fragment.querySelector("h1").textContent = work.title;
  fragment.querySelector(".manga-description").textContent = work.description;
  fragment.querySelector(".chapter-count").textContent = `${work.chapters.length} capitulo${work.chapters.length === 1 ? "" : "s"}`;

  fragment.querySelector(".manga-badges").innerHTML = `
    <span>${work.status}</span>
    <span>${work.rating}</span>
    <span>${work.chapters.length} capitulo${work.chapters.length === 1 ? "" : "s"}</span>
  `;

  fragment.querySelector(".manga-actions").innerHTML = `
    <a class="button primary" href="${chapterUrl(work, 0)}">Ler primeiro capitulo</a>
  `;

  fragment.querySelector(".manga-facts").innerHTML = `
    <h2>Informacoes</h2>
    <dl>
      <div><dt>Autor</dt><dd>Nanquimori</dd></div>
      <div><dt>Genero</dt><dd>${work.genre}</dd></div>
      <div><dt>Status</dt><dd>${work.status}</dd></div>
      <div><dt>Classificacao</dt><dd>${work.rating}</dd></div>
      <div><dt>Publicacao</dt><dd>Obras oficiais do KapiTomo</dd></div>
    </dl>
  `;

  fragment.querySelector(".chapter-list").innerHTML = work.chapters
    .map(
      (chapter, index) => `
        <a class="chapter-row" href="${chapterUrl(work, index)}">
          <span>
            <strong>${chapter.title}</strong>
            <small>${chapter.date}</small>
          </span>
          <em>Ler capitulo</em>
        </a>
      `
    )
    .join("");

  workView.innerHTML = "";
  workView.appendChild(page);
  showRoute(workView);
}

function renderChapterPage(work, chapterIndex = 0) {
  const requestedIndex = Number.isFinite(chapterIndex) ? chapterIndex : 0;
  const safeIndex = Math.min(Math.max(requestedIndex, 0), work.chapters.length - 1);
  const chapter = work.chapters[safeIndex];
  const previousIndex = safeIndex > 0 ? safeIndex - 1 : null;
  const nextIndex = safeIndex < work.chapters.length - 1 ? safeIndex + 1 : null;
  const fragment = chapterTemplate.content.cloneNode(true);
  const page = fragment.querySelector(".chapter-page");
  const paragraphs = getChapterParagraphs(chapter);
  const isNovel = chapter.contentType === "novel";
  const wordCount = getWordCount(paragraphs);

  fragment.querySelector(".back-link").href = workUrl(work);
  fragment.querySelector(".eyebrow").textContent = work.title;
  fragment.querySelector("h1").textContent = isNovel ? `Capitulo ${String(safeIndex + 1)}` : chapter.title;
  fragment.querySelector(".chapter-tools").innerHTML = `
    ${previousIndex === null ? '<span class="button ghost disabled">Anterior</span>' : `<a class="button secondary" href="${chapterUrl(work, previousIndex)}">Anterior</a>`}
    <a class="button secondary" href="${workUrl(work)}">Lista de capitulos</a>
    ${nextIndex === null ? '<span class="button ghost disabled">Proximo</span>' : `<a class="button primary" href="${chapterUrl(work, nextIndex)}">Proximo</a>`}
  `;

  if (isNovel) {
    page.classList.add("novel-page");
    fragment.querySelector(".chapter-header").insertAdjacentHTML(
      "beforeend",
      `<p class="novel-meta">${wordCount} palavras <span>~${getReadingMinutes(wordCount)} min de leitura</span></p>`
    );
    fragment.querySelector(".webtoon-strip").className = "novel-reader";
    fragment.querySelector(".novel-reader").innerHTML = paragraphs
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  } else {
    fragment.querySelector(".webtoon-strip").innerHTML = [
      `<section class="webtoon-cover-panel"><img src="${work.cover}" alt="Capa de ${work.title}"><div><span>${work.title}</span><strong>${chapter.title}</strong></div></section>`,
      ...paragraphs.map(
        (pageText, index) => `
          <section class="webtoon-panel">
            <small>${String(index + 1).padStart(2, "0")}</small>
            <p>${pageText}</p>
          </section>
        `
      )
    ].join("");
  }

  fragment.querySelector(".chapter-footer").innerHTML = `
    <a class="button secondary" href="${workUrl(work)}">Voltar para ${work.title}</a>
    ${nextIndex === null ? "" : `<a class="button primary" href="${chapterUrl(work, nextIndex)}">Ler proximo capitulo</a>`}
  `;

  chapterView.innerHTML = "";
  chapterView.appendChild(page);
  showRoute(chapterView);
}

function handleRoute() {
  const [route, workId, chapterIndex] = window.location.hash.replace(/^#/, "").split("/");
  const work = getWork(workId);

  if (route === "obra" && work) {
    renderWorkPage(work);
    return;
  }

  if (route === "ler" && work) {
    renderChapterPage(work, Number(chapterIndex || 0));
    return;
  }

  showHome();
}

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

if (query) {
  searchInput.value = query;
}

window.addEventListener("hashchange", handleRoute);

renderWorks();
handleRoute();
