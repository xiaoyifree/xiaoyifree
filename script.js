const data = window.siteData;

const categoryGrid = document.querySelector("#categoryGrid");
const featuredCard = document.querySelector("#featuredCard");
const featuredList = document.querySelector("#featuredList");
const filterGroup = document.querySelector("#filterGroup");
const searchInput = document.querySelector("#searchInput");
const collectionPanel = document.querySelector("#collectionPanel");
const libraryGrid = document.querySelector("#libraryGrid");
const detailModal = document.querySelector("#detailModal");
const detailContent = document.querySelector("#detailContent");
const detailClose = document.querySelector("#detailClose");

let activeCategory = "all";
let activeQuery = "";

function initSite() {
  bindSiteMeta();
  renderCategories();
  renderFeatured();
  renderFilters();
  renderLibrary();
  bindEvents();
  openPostFromHash();
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
        <article class="category-card accent-${category.accent}" role="button" tabindex="0" data-filter-category="${category.id}">
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
  featuredCard.className = `featured-highlight accent-${leadCategory.accent}${lead.type === "article" ? " content-card--interactive" : ""}`;
  if (lead.type === "article") {
    featuredCard.setAttribute("data-open-post", lead.id);
    featuredCard.setAttribute("role", "link");
    featuredCard.setAttribute("tabindex", "0");
  } else {
    featuredCard.removeAttribute("data-open-post");
    featuredCard.removeAttribute("role");
    featuredCard.removeAttribute("tabindex");
  }
  featuredCard.innerHTML = `
    <span class="featured-pill">${escapeHtml(leadCategory.name)}</span>
    <h3>${escapeHtml(lead.title)}</h3>
    <p>${escapeHtml(lead.summary)}</p>
    <div class="meta-row">
      <span>${escapeHtml(lead.readTime)}</span>
      <span>${lead.type === "video" ? "视频链接" : "图文内容"}</span>
    </div>
    ${renderPostAction(lead, "button primary")}
  `;

  featuredList.innerHTML = featuredPosts
    .slice(1)
    .map((post) => {
      const category = findCategory(post.category);
      return `
        <article class="featured-mini accent-${category.accent}${post.type === "article" ? " content-card--interactive" : ""}"${post.type === "article" ? ` data-open-post="${escapeAttribute(post.id)}" role="link" tabindex="0"` : ""}>
          <span>${escapeHtml(category.name)}</span>
          <strong>${escapeHtml(post.title)}</strong>
          <p>${escapeHtml(post.summary)}</p>
          ${renderPostAction(post, "text-link")}
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
  renderCollectionPanel(filteredPosts);

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
      const openAttr = post.type === "article" ? ` data-open-post="${escapeAttribute(post.id)}"` : "";

      return `
        <article class="content-card${post.type === "article" ? " content-card--interactive" : ""}"${post.type === "article" ? ' role="link" tabindex="0"' : ""}${openAttr}>
          ${visual}
          <div class="content-body">
            <div class="content-top">
              <span class="content-type">${post.type === "video" ? "视频链接" : "图文内容"}</span>
              <span class="content-time">${escapeHtml(post.readTime)}</span>
            </div>
            <h3>${escapeHtml(post.title)}</h3>
            <p>${escapeHtml(post.summary)}</p>
            <div class="tag-row">${tags}</div>
            ${renderPostAction(post, "text-link")}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCollectionPanel(filteredPosts) {
  const category = activeCategory === "all" ? null : findCategory(activeCategory);
  const title = category ? category.name : "全部内容";
  const description = category
    ? `${category.description} 这里会集中展示这个分类下的图文内容和视频链接。`
    : "这里汇总整个站点的所有内容。你可以继续按分类筛选，或搜索具体主题。";
  const articleCount = filteredPosts.filter((post) => post.type === "article").length;
  const videoCount = filteredPosts.filter((post) => post.type === "video").length;

  collectionPanel.innerHTML = `
    <div class="collection-copy">
      <span class="featured-pill">${escapeHtml(title)}</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
    </div>
    <div class="collection-stats">
      <div>
        <strong>${filteredPosts.length}</strong>
        <span>子内容</span>
      </div>
      <div>
        <strong>${articleCount}</strong>
        <span>图文</span>
      </div>
      <div>
        <strong>${videoCount}</strong>
        <span>视频链接</span>
      </div>
    </div>
  `;
}

function bindEvents() {
  searchInput.addEventListener("input", (event) => {
    activeQuery = event.target.value;
    renderLibrary();
  });

  document.addEventListener("click", (event) => {
    const postTrigger = event.target.closest("[data-open-post]");
    if (postTrigger) {
      openPost(postTrigger.dataset.openPost);
      return;
    }

    const categoryTrigger = event.target.closest("[data-filter-category]");
    if (categoryTrigger) {
      activeCategory = categoryTrigger.dataset.filterCategory;
      renderFilters();
      renderLibrary();
      document.querySelector("#library")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (event.target.closest("[data-close-detail='true']")) {
      closePost();
    }
  });

  document.addEventListener("keydown", (event) => {
    const postTrigger = event.target.closest("[data-open-post]");
    const categoryTrigger = event.target.closest("[data-filter-category]");

    if ((event.key === "Enter" || event.key === " ") && postTrigger) {
      event.preventDefault();
      openPost(postTrigger.dataset.openPost);
    }

    if ((event.key === "Enter" || event.key === " ") && categoryTrigger) {
      event.preventDefault();
      activeCategory = categoryTrigger.dataset.filterCategory;
      renderFilters();
      renderLibrary();
      document.querySelector("#library")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (event.key === "Escape" && detailModal.classList.contains("is-open")) {
      closePost();
    }
  });

  detailClose.addEventListener("click", closePost);
  window.addEventListener("hashchange", openPostFromHash);
}

function renderPostAction(post, className) {
  if (post.type === "video") {
    return `
      <a class="${className}" href="${escapeAttribute(post.ctaUrl)}" target="_blank" rel="noreferrer">
        ${escapeHtml(post.ctaLabel)}
      </a>
    `;
  }

  return `
    <button class="${className} button-reset" type="button" data-open-post="${escapeAttribute(post.id)}">
      ${escapeHtml(post.ctaLabel)}
    </button>
  `;
}

function openPost(postId) {
  const post = findPost(postId);
  if (!post || post.type === "video") {
    return;
  }

  const category = findCategory(post.category);
  const sections = (post.content || [])
    .map(
      (section) => `
        <section class="detail-section">
          <h3>${escapeHtml(section.heading)}</h3>
          <p>${escapeHtml(section.body)}</p>
        </section>
      `
    )
    .join("");
  const takeaways = (post.takeaways || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
  const tags = (post.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");

  detailContent.innerHTML = `
    <span class="featured-pill">${escapeHtml(category.name)}</span>
    <div class="detail-meta">
      <span>${escapeHtml(post.readTime)}</span>
      <span>图文内容</span>
    </div>
    <h2 id="detailTitle">${escapeHtml(post.title)}</h2>
    <p class="detail-summary">${escapeHtml(post.summary)}</p>
    <div class="detail-tags">${tags}</div>
    <div class="detail-body">
      ${sections || `<section class="detail-section"><h3>内容摘要</h3><p>${escapeHtml(post.summary)}</p></section>`}
      ${takeaways ? `<section class="detail-section"><h3>重点提示</h3><ul>${takeaways}</ul></section>` : ""}
    </div>
  `;

  detailModal.classList.add("is-open");
  detailModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  detailClose.focus();

  if (window.location.hash !== `#post-${post.id}`) {
    window.location.hash = `post-${post.id}`;
  }
}

function closePost() {
  detailModal.classList.remove("is-open");
  detailModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (window.location.hash.startsWith("#post-")) {
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}#library`);
  }
}

function openPostFromHash() {
  if (!window.location.hash.startsWith("#post-")) {
    if (detailModal.classList.contains("is-open")) {
      detailModal.classList.remove("is-open");
      detailModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }
    return;
  }

  const postId = window.location.hash.replace("#post-", "");
  openPost(postId);
}

function findCategory(categoryId) {
  return data.categories.find((category) => category.id === categoryId) || data.categories[0];
}

function findPost(postId) {
  return data.posts.find((post) => post.id === postId);
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

initSite();
