document.addEventListener("DOMContentLoaded", () => {
  /* Add a project: folder name (next to index.html), image count (1 … n).
     Images can be .png, .jpg or .jpeg, named 1, 2, 3 … and may be mixed in one folder. */
  const PROJECTS = [
    { title: "The Called Out", category: "social",   label: "Social Media", folder: "Social Media 1", count: 8 },
    { title: "Winnie Co Brand Identity",      category: "branding", label: "Branding",     folder: "Branding 1",     count: 6 },
    { title: "The Seat of Kings", category: "social",   label: "Social Media", folder: "Social Media 2", count: 11 },
    { title: "SPE Oil & Gas Week", category: "social",   label: "Social Media", folder: "Social Media 3", count: 7 },
  ];
  const EXTS = ["png", "jpg", "jpeg", "PNG", "JPG", "JPEG"];
  const $ = (id) => document.getElementById(id);

  /* Loads image n of project p, trying each file type until one is found. */
  function setSrc(img, p, n) {
    const order = p.ext ? [p.ext, ...EXTS.filter((e) => e !== p.ext)] : EXTS;
    let i = 0;
    const tryNext = () => {
      if (i >= order.length) { img.onerror = null; return; }
      img.src = encodeURI(`${p.folder}/${n}.${order[i++]}`);
    };
    img.onload = () => { p.ext = order[i - 1]; };
    img.onerror = tryNext;
    tryNext();
  }

  /* Gallery */
  const list = $("projects");
  PROJECTS.forEach((p, i) => {
    const el = document.createElement("article");
    el.className = `project ${i % 2 ? "right" : "left"} reveal`;
    el.dataset.category = p.category;
    el.innerHTML = `
      <button class="project-media" aria-label="Open ${p.title} gallery">
        <img alt="${p.title} cover" loading="${i ? "lazy" : "eager"}" />
      </button>
      <div class="project-info">
        <span class="project-cat">${String(i + 1).padStart(2, "0")} — ${p.label}</span>
        <h3>${p.title}</h3>
        <button class="link-btn">View project (${p.count}) &rarr;</button>
      </div>`;
    setSrc(el.querySelector("img"), p, 1);
    el.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => openLb(p, 0)));
    list.appendChild(el);
  });

  /* Hero strip uses real covers */
  PROJECTS.forEach((p) => {
    const img = document.createElement("img");
    img.alt = ""; img.loading = "lazy";
    setSrc(img, p, 1);
    $("heroStrip").appendChild(img);
  });

  /* Filters */
  const items = [...document.querySelectorAll(".project")];
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      let shown = 0;
      items.forEach((it) => {
        const ok = f === "all" || it.dataset.category === f;
        if (ok) { shown++; it.hidden = false; requestAnimationFrame(() => it.classList.add("in")); }
        else { it.classList.remove("in"); setTimeout(() => { it.hidden = true; }, 300); }
      });
      $("empty").hidden = shown !== 0;
    });
  });

  /* Lightbox */
  const lb = $("lightbox");
  let cur = null, idx = 0, opener = null;
  const render = () => {
    setSrc($("lbImg"), cur, idx + 1);
    $("lbImg").alt = `${cur.title} — image ${idx + 1}`;
    $("lbTitle").textContent = cur.title;
    $("lbCount").textContent = `${idx + 1} / ${cur.count}`;
  };
  function openLb(p, i) {
    opener = document.activeElement; cur = p; idx = i; render();
    lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; $("lbClose").focus();
  }
  function closeLb() {
    lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; cur = null; if (opener) opener.focus();
  }
  const step = (d) => { if (cur) { idx = (idx + d + cur.count) % cur.count; render(); } };
  $("lbClose").onclick = closeLb;
  $("lbPrev").onclick = () => step(-1);
  $("lbNext").onclick = () => step(1);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* Scroll reveals */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* Mobile menu */
  const links = $("navLinks"), mb = $("menuBtn");
  const setMenu = (open) => { links.classList.toggle("open", open); mb.setAttribute("aria-expanded", open); };
  mb.onclick = () => setMenu(!links.classList.contains("open"));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  /* Nav state + active link */
  const navEl = $("nav");
  const onScroll = () => navEl.classList.toggle("scrolled", scrollY > 20);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });
  const secs = ["home", "work", "about", "services", "contact"].map($);
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.querySelectorAll("a").forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach((s) => spy.observe(s));

  $("year").textContent = new Date().getFullYear();
});
