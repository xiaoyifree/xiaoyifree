const data = window.siteData;

const categoryGrid = document.querySelector("#categoryGrid");
const featuredCard = document.querySelector("#featuredCard");
const featuredList = document.querySelector("#featuredList");
const filterGroup = document.querySelector("#filterGroup");
const searchInput = document.querySelector("#searchInput");
const libraryGrid = document.querySelector("#libraryGrid");

let activeCategory = "all";
let activeQuery = "";

function initSite() {
  bindSiteMeta();
  renderCategories();
  renderFeatured();
  renderFilters();
  renderLibrary();
}

function bindSiteMeta() {
  document.title = `${data.siteName} | 健身科普站`;
  document.querySelector("#siteName").textContent = data.siteName;
  document.querySelector("#siteTagline").textContent = data.siteTagline;
  document.querySelector("#heroEyebrow").textContent = data.heroEyebrow;
  document.querySelector("#heroTitle").textContent = data.heroTitle;
  document.querySelector("#heroDescription").textContent = data.heroDescription;
  document.querySelector("#footerText").textContent = data.footerText;
  document.querySelector("#metricCategories").textContent = String(data.categories.length);
  document.querySelector("#metricPosts").textContent = String(data.posts.length);
}

function renderCategories() {
  categoryGrid.innerHTML = data.categories
    .map(
      (category, index) => `
        <article class="category-card accent-${category.accent}">
          <span class="category-index">0${index + 1}</span>
          <h3>${escapeHtml(category.name)}</h3>
          <p>${escapeHtml(category.description)}</p>
        </article>
      `
    )
    .join("");
}

function renderFeatured() {
  const featuredPosts = data.posts.filter((post) => post.featured);
  const lead = featuredPosts[0];

  if (!lead) {
    featuredCard.innerHTML = "<h3>暂未设置精选内容</h3><p>你可以在 site-data.js 里把 featured 改成 true。</p>";
    featuredList.innerHTML = "";
    return;
  }

  const leadCategory = findCategory(lead.category);
  featuredCard.className = `featured-highlight accent-${leadCategory.accent}`;
  featuredCard.innerHTML = `
    <span class="featured-pill">${escapeHtml(leadCategory.name)}</span>
    <h3>${escapeHtml(lead.title)}</h3>
    <p>${escapeHtml(lead.summary)}</p>
    <div class="meta-row">
      <span>${escapeHtml(lead.readTime)}</span>
      <span>${lead.type === "video" ? "Bilibili 视频" : "图文内容"}</span>
    </div>
    <a class="button primary" href="${escapeAttribute(lead.ctaUrl)}" target="${lead.type === "video" ? "_blank" : "_self"}" rel="noreferrer">
      ${escapeHtml(lead.ctaLabel)}
    </a>
  `;

  featuredList.innerHTML = featuredPosts
    .slice(1)
    .map((post) => {
      const category = findCategory(post.category);
      return `
        <article class="featured-mini accent-${category.accent}">
          <span>${escapeHtml(category.name)}</span>
          <strong>${escapeHtml(post.title)}</strong>
          <p>${escapeHtml(post.summary)}</p>
          <a href="${escapeAttribute(post.ctaUrl)}" target="${post.type === "video" ? "_blank" : "_self"}" rel="noreferrer">
            ${escapeHtml(post.ctaLabel)}
          </a>
        </article>
      `;
    })
    .join("");
}

function renderFilters() {
  const filters = [{ id: "all", name: "全部" }, ...data.categories.map((category) => ({ id: category.id, name: category.name }))];

  filterGroup.innerHTML = filters
    .map(
      (filter) => `
        <button class="filter-chip${filter.id === activeCategory ? " active" : ""}" type="button" data-filter="${filter.id}">
          ${escapeHtml(filter.name)}
        </button>
      `
    )
    .join("");

  filterGroup.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      renderFilters();
      renderLibrary();
    });
  });
}

function renderLibrary() {
  const query = activeQuery.trim().toLowerCase();
  const filteredPosts = data.posts.filter((post) => {
    const inCategory = activeCategory === "all" || post.category === activeCategory;
    const haystack = `${post.title} ${post.summary} ${(post.tags || []).join(" ")}`.toLowerCase();
    return inCategory && haystack.includes(query);
  });

  if (!filteredPosts.length) {
    libraryGrid.innerHTML = `
      <article class="empty-card">
        <h3>没有找到匹配内容</h3>
        <p>你可以切换分类，或者在 <code>site-data.js</code> 里继续补充新条目。</p>
      </article>
    `;
    return;
  }

  libraryGrid.innerHTML = filteredPosts
    .map((post) => {
      const category = findCategory(post.category);
      const tags = (post.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
      const visual = post.image
        ? `<div class="content-visual" style="background-image:url('${escapeAttribute(post.image)}')"></div>`
        : `<div class="content-visual accent-${category.accent}"><strong>${escapeHtml(category.name)}</strong></div>`;

      return `
        <article class="content-card">
          ${visual}
          <div class="content-body">
            <div class="content-top">
              <span class="content-type">${post.type === "video" ? "Bilibili 视频" : "图文内容"}</span>
              <span class="content-time">${escapeHtml(post.readTime)}</span>
            </div>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.summary)}</p>
            <div class="tag-row">${tags}</div>
            <a class="text-link" href="${escapeAttribute(post.ctaUrl)}" target="${post.type === "video" ? "_blank" : "_self"}" rel="noreferrer">
              ${escapeHtml(post.ctaLabel)}
            </a>
          </div>
        </article>
      `;
    })
    .join("");
}

function findCategory(categoryId) {
  return data.categories.find((category) => category.id === categoryId) || data.categories[0];
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "");
}

searchInput.addEventListener("input", (event) => {
  activeQuery = event.target.value;
  renderLibrary();
});

initSite();
