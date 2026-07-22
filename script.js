document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     Project data
     Each project points at a folder (relative to index.html) containing
     images numbered 1.png, 2.png, ... up to `count`.
     To add a new project later, just add another entry here.
     ========================================================================== */
  const PROJECTS = [
    {
      id: "social-1",
      title: "Social Media Campaign 1",
      category: "social",
      folder: "Social Media 1",
      count: 9,
    },
    {
      id: "social-2",
      title: "Social Media Campaign 2",
      category: "social",
      folder: "Social Media 2",
      count: 11,
    },
    {
      id: "social-3",
      title: "Social Media Campaign 3",
      category: "social",
      folder: "Social Media 3",
      count: 7,
    },
    {
      id: "branding-1",
      title: "Branding Project 1",
      category: "branding",
      folder: "Branding 1",
      count: 6,
    },
  ];

  const EXT = "png";

  function imagePath(folder, n) {
    return encodeURI(`${folder}/${n}.${EXT}`);
  }

  /* ==========================================================================
     Build the portfolio grid
     ========================================================================== */
  const grid = document.getElementById("portfolioGrid");
  const emptyMsg = document.getElementById("portfolioEmpty");

  PROJECTS.forEach((project) => {
    const item = document.createElement("div");
    item.className = "portfolio-item";
    item.setAttribute("data-category", project.category);
    item.setAttribute("data-project", project.id);

    item.innerHTML = `
      <button class="portfolio-item-btn" aria-label="View ${project.title} gallery">
        <img
          src="${imagePath(project.folder, 1)}"
          alt="${project.title} cover"
          class="portfolio-cover-img"
          loading="lazy"
        />
        <div class="portfolio-item-overlay">
          <span class="portfolio-item-title">${project.title}</span>
          <span class="portfolio-item-count">${project.count} image${project.count === 1 ? "" : "s"}</span>
        </div>
      </button>
    `;

    item.querySelector(".portfolio-item-btn").addEventListener("click", () => {
      openLightbox(project, 0);
    });

    grid.appendChild(item);
  });

  /* ==========================================================================
     Filtering
     ========================================================================== */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  function applyFilter(filterValue) {
    let visibleCount = 0;

    portfolioItems.forEach((item) => {
      const matches =
        filterValue === "all" || item.getAttribute("data-category") === filterValue;

      if (matches) {
        visibleCount++;
        item.classList.remove("hidden");
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "scale(1)";
        }, 50);
      } else {
        item.style.opacity = "0";
        item.style.transform = "scale(0.95)";
        setTimeout(() => {
          item.classList.add("hidden");
        }, 400);
      }
    });

    emptyMsg.hidden = visibleCount !== 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      applyFilter(button.getAttribute("data-filter"));
    });
  });

  /* ==========================================================================
     Lightbox gallery
     ========================================================================== */
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  let activeProject = null;
  let activeIndex = 0;

  function renderLightboxImage() {
    if (!activeProject) return;
    const imgNumber = activeIndex + 1;
    lightboxImage.src = imagePath(activeProject.folder, imgNumber);
    lightboxImage.alt = `${activeProject.title} — image ${imgNumber}`;
    lightboxTitle.textContent = activeProject.title;
    lightboxCounter.textContent = `${imgNumber} / ${activeProject.count}`;
  }

  function openLightbox(project, startIndex) {
    activeProject = project;
    activeIndex = startIndex;
    renderLightboxImage();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    activeProject = null;
  }

  function showPrev() {
    if (!activeProject) return;
    activeIndex = (activeIndex - 1 + activeProject.count) % activeProject.count;
    renderLightboxImage();
  }

  function showNext() {
    if (!activeProject) return;
    activeIndex = (activeIndex + 1) % activeProject.count;
    renderLightboxImage();
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrev);
  lightboxNext.addEventListener("click", showNext);

  // Close when clicking the dark backdrop, not the image/content itself
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrev();
    if (e.key === "ArrowRight") showNext();
  });
});
