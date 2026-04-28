/* =============================================
   main.js — Mariah Lopez Portfolio
   ============================================= */

(function () {
  "use strict";

  /* Module-level reference to canvas init; set by initWireframeCanvas IIFE
     so renderCaseStudy can initialise dynamically-added canvases. */
  var _initCanvas = null;

  /* Module-level reference to scroll-reveal observer init; set in section 11
     so renderCaseStudy can observe dynamically-added .reveal elements. */
  var _initReveal = null;

  /* ------------------------------------------
     1. Navigation: Hamburger Menu Toggle
     ------------------------------------------ */
  const hamburger = document.querySelector(".hamburger");
  const navList = document.querySelector(".site-nav__list");

  if (hamburger && navList) {
    hamburger.addEventListener("click", function () {
      const isOpen = navList.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (
        navList.classList.contains("open") &&
        !hamburger.contains(e.target) &&
        !navList.contains(e.target)
      ) {
        navList.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navList.classList.contains("open")) {
        navList.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.focus();
      }
    });
  }

  /* ------------------------------------------
     2. Active Nav State
     ------------------------------------------ */
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".site-nav__link");
  navLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    if (
      href === currentPage ||
      (currentPage === "" && href === "index.html") ||
      (currentPage === "index.html" && href === "index.html")
    ) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* ------------------------------------------
     3. Sticky Header Shadow on Scroll
     ------------------------------------------ */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = function () {
      if (window.scrollY > 4) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------
     4. Smooth Scroll for Anchor Links
     ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    });
  });

  /* ------------------------------------------
     Helper: Build Project Card HTML
     ------------------------------------------ */
  function buildProjectCard(project) {
    const tagsHtml = (project.tags || [])
      .map(function (t) {
        return '<span class="tag">' + escapeHtml(t) + "</span>";
      })
      .join("");

    const analyticsAttrs = project.analyticsCategory
      ? ' data-analytics-category="' +
        escapeHtml(project.analyticsCategory) +
        '" data-analytics-project="' +
        escapeHtml(project.slug) +
        '"'
      : "";

    return (
      '<article class="project-card"' +
      analyticsAttrs +
      ">" +
      '<img class="project-card__image" src="' +
      escapeHtml(project.heroImage || "assets/placeholder.svg") +
      '" alt="' +
      escapeHtml(project.title) +
      ' project image" loading="lazy" width="800" height="450">' +
      '<div class="project-card__body">' +
      '<p class="project-card__role">' +
      escapeHtml(project.role || "") +
      "</p>" +
      '<h3 class="project-card__title">' +
      escapeHtml(project.title) +
      "</h3>" +
      '<p class="project-card__summary">' +
      escapeHtml(project.strategicSummary || "") +
      "</p>" +
      '<div class="project-card__tags">' +
      tagsHtml +
      "</div>" +
      '<div class="project-card__footer">' +
      '<a href="case-study.html?slug=' +
      encodeURIComponent(project.slug) +
      '" class="btn btn--outline btn--sm"' +
      analyticsAttrs +
      ">View Project</a>" +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  /* ------------------------------------------
     Helper: Escape HTML
     ------------------------------------------ */
  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  }

  /* ------------------------------------------
     5. Featured Projects Loader (index.html)
     ------------------------------------------ */
  const featuredContainer = document.getElementById("featured-projects");
  if (featuredContainer) {
    featuredContainer.innerHTML =
      '<div class="loading-state"><div class="spinner"></div><p>Loading projects…</p></div>';

    fetch("data/projects.json")
      .then(function (res) {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(function (projects) {
        const featured = projects.slice(0, 3);
        const grid = document.createElement("div");
        grid.className = "projects-grid";
        featured.forEach(function (project) {
          grid.insertAdjacentHTML("beforeend", buildProjectCard(project));
        });
        featuredContainer.innerHTML = "";
        featuredContainer.appendChild(grid);
        const viewAll = document.createElement("div");
        viewAll.style.textAlign = "center";
        viewAll.style.marginTop = "2rem";
        viewAll.innerHTML =
          '<a href="projects.html" class="btn btn--outline">View All Projects</a>';
        featuredContainer.appendChild(viewAll);
      })
      .catch(function () {
        featuredContainer.innerHTML =
          '<div class="error-state"><p>Unable to load projects. Please try again later.</p></div>';
      });
  }

  /* ------------------------------------------
     6. Projects Page Loader (projects.html)
     ------------------------------------------ */
  const projectsGrid = document.getElementById("projects-grid");
  if (projectsGrid) {
    projectsGrid.innerHTML =
      '<div class="loading-state"><div class="spinner"></div><p>Loading projects…</p></div>';

    fetch("data/projects.json")
      .then(function (res) {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(function (projects) {
        const grid = document.createElement("div");
        grid.className = "projects-grid";

        projects.forEach(function (project) {
          const cardWrapper = document.createElement("div");
          cardWrapper.setAttribute(
            "data-tags",
            (project.tags || []).join(",")
          );
          cardWrapper.innerHTML = buildProjectCard(project);
          grid.appendChild(cardWrapper);
        });

        projectsGrid.innerHTML = "";
        projectsGrid.appendChild(grid);

        initFilters(projects, grid);
      })
      .catch(function () {
        projectsGrid.innerHTML =
          '<div class="error-state"><p>Unable to load projects. Please try again later.</p></div>';
      });
  }

  /* ------------------------------------------
     6a. Project Filters
     ------------------------------------------ */
  function initFilters(projects, grid) {
    const filterBtns = document.querySelectorAll(".filter-btn");
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) {
          b.classList.remove("active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-pressed", "true");

        const filter = btn.getAttribute("data-filter");
        const cards = grid.querySelectorAll("[data-tags]");

        cards.forEach(function (card) {
          const tags = card.getAttribute("data-tags") || "";
          if (filter === "all" || tags.includes(filter)) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });

        // Show empty state if no visible cards
        const visible = Array.from(cards).filter(function (c) {
          return c.style.display !== "none";
        });
        let emptyMsg = grid.querySelector(".no-results");
        if (visible.length === 0) {
          if (!emptyMsg) {
            emptyMsg = document.createElement("p");
            emptyMsg.className = "no-results";
            emptyMsg.style.gridColumn = "1 / -1";
            emptyMsg.style.textAlign = "center";
            emptyMsg.style.color = "var(--color-text-secondary)";
            emptyMsg.style.padding = "2rem 0";
            emptyMsg.textContent = "No projects match this filter.";
            grid.appendChild(emptyMsg);
          }
        } else {
          if (emptyMsg) emptyMsg.remove();
        }
      });
    });
  }

   /* ------------------------------------------
     7. Case Study Loader (case-study.html)
     ------------------------------------------ */
  const caseStudyMain = document.getElementById("case-study-content");
  if (caseStudyMain) {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    if (!slug) {
      caseStudyMain.innerHTML = renderError(
        "No project specified.",
        "Please return to the <a href='projects.html'>Projects page</a> and select a project."
      );
    } else {
      caseStudyMain.innerHTML =
        '<div class="loading-state"><div class="spinner"></div><p>Loading case study…</p></div>';

      fetch("data/projects.json")
        .then(function (res) {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then(function (projects) {
          const project = projects.find(function (p) {
            return p.slug === slug;
          });

          if (!project) {
            caseStudyMain.innerHTML = renderError(
              "Project not found.",
              "The case study you're looking for doesn't exist. <a href='projects.html'>View all projects →</a>"
            );
            document.title = "Project Not Found — Mariah Lopez";
            return;
          }

          document.title = project.title + " — Mariah Lopez";
          renderCaseStudy(project, caseStudyMain);
        })
        .catch(function () {
          caseStudyMain.innerHTML = renderError(
            "Unable to load case study.",
            "Please try again later or <a href='projects.html'>return to projects</a>."
          );
        });
    }
  }

  function renderError(heading, message) {
    return (
      '<div class="error-state container" style="padding-block:4rem">' +
      "<h2>" +
      escapeHtml(heading) +
      "</h2>" +
      "<p>" +
      message +
      "</p>" +
      "</div>"
    );
  }

  function renderCaseStudy(p, container) {
    const tagsHtml = (p.tags || [])
      .map(function (t) {
        return '<span class="tag">' + escapeHtml(t) + "</span>";
      })
      .join("");

    const toolsHtml = (p.tools || [])
      .map(function (t) {
        return '<span class="badge">' + escapeHtml(t) + "</span>";
      })
      .join("");

    const respHtml = (p.responsibilities || [])
      .map(function (r) {
        return "<li>" + escapeHtml(r) + "</li>";
      })
      .join("");

    const linksHtml = (p.externalLinks || [])
      .map(function (l) {
        var href = l.url || l.src || "#";

        return (
          '<a href="' +
          escapeHtml(href) +
          '" class="btn btn--outline" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(l.label || "View Project") +
          "</a>"
        );
      })
      .join("");

    const videoHtml = buildVideoEmbed(p.videoEmbed);

    const sections = [
      { key: "overview", label: "Overview" },
      { key: "problemAndGoals", label: "Problem & Goals" },
      { key: "myRole", label: "My Role" },
      { key: "discoveryAndConstraints", label: "Discovery & Constraints" },
      { key: "informationArchitecture", label: "Information Architecture" },
      { key: "userFlows", label: "User Flows" },
      { key: "wireframesAndPrototypes", label: "Wireframes & Prototypes" },
      { key: "requirementsAndCriteria", label: "Requirements & Acceptance Criteria" },
      { key: "qaAndIteration", label: "Analytics & Iteration" },
      { key: "outcomesAndNextSteps", label: "Outcomes & Next Steps" }
    ];

    const filteredSections = sections.filter(function (s) {
      return p[s.key];
    });

    const respBandHtml =
      '<div class="cs-section-band reveal">' +
      '<div class="container">' +
      '<section class="case-study-section" aria-labelledby="section-responsibilities">' +
      '<h2 class="case-study-section__title" id="section-responsibilities">Responsibilities</h2>' +
      '<ul class="responsibilities-list">' +
      respHtml +
      "</ul>" +
      (toolsHtml
        ? '<h3 class="cs-tools-heading">Tools Used</h3>' +
          '<div class="tools-list">' +
          toolsHtml +
          "</div>"
        : "") +
      "</section>" +
      "</div>" +
      "</div>";

    const sectionBandsHtml = filteredSections
      .map(function (s, i) {
        var img = (p.sectionImages && p.sectionImages[s.key]) || null;
        var side = i % 2 === 0 ? "right" : "left";

        var imgHtml;
        if (!img) {
          imgHtml = '<div class="cs-section-band__image cs-section-band__image--empty"></div>';
        } else if (Array.isArray(img)) {
          imgHtml =
            '<div class="cs-section-band__image cs-section-band__image--multi">' +
            img
              .map(function (item) {
                return (
                  '<figure>' +
                  '<img src="' + escapeHtml(item.src) + '" alt="' + escapeHtml(item.alt) + '" loading="lazy">' +
                  '<figcaption>' + escapeHtml(item.caption || item.alt || "") + "</figcaption>" +
                  "</figure>"
                );
              })
              .join("") +
            "</div>";
        } else {
          imgHtml =
            '<figure class="cs-section-band__image">' +
            '<img src="' + escapeHtml(img.src) + '" alt="' + escapeHtml(img.alt) + '" loading="lazy">' +
            '<figcaption>' + escapeHtml(img.caption || img.alt || "") + "</figcaption>" +
            "</figure>";
        }

        return (
          '<div class="cs-section-band cs-section-band--image-' + side + ' reveal">' +
          '<div class="container">' +
          '<div class="cs-section-band__inner">' +

          '<section class="case-study-section cs-section-band__content" aria-labelledby="section-' +
          s.key +
          '">' +
          '<h2 class="case-study-section__title" id="section-' +
          s.key +
          '">' +
          s.label +
          "</h2>" +
          "<p>" +
          escapeHtml(p[s.key]) +
          "</p>" +
          "</section>" +

          imgHtml +

          "</div>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    const videoBandHtml = videoHtml
      ? '<div class="cs-section-band reveal">' +
        '<div class="container">' +
        '<section class="case-study-section" aria-labelledby="section-video">' +
        '<h2 class="case-study-section__title" id="section-video">Video Walkthrough</h2>' +
        videoHtml +
        "</section>" +
        "</div>" +
        "</div>"
      : "";

    container.innerHTML =
      '<div class="case-study-hero">' +
      '<canvas class="section__canvas" aria-hidden="true"></canvas>' +
      '<div class="container">' +
      '<nav aria-label="Breadcrumb" style="margin-bottom:1rem;font-size:0.9375rem">' +
      '<a href="projects.html">← Back to Projects</a>' +
      "</nav>" +
      '<div class="case-study-hero__content">' +
      '<div class="case-study-hero__meta">' +
      '<span class="case-study-hero__role">' +
      escapeHtml(p.role || "") +
      "</span>" +
      '<div class="project-card__tags">' +
      tagsHtml +
      "</div>" +
      "</div>" +
      '<h1 class="case-study-hero__title">' +
      escapeHtml(p.title || "") +
      "</h1>" +
      '<p class="case-study-hero__summary">' +
      escapeHtml(p.strategicSummary || "") +
      "</p>" +
      (linksHtml ? '<div class="case-study-links">' + linksHtml + "</div>" : "") +
      "</div>" +
      "</div>" +
      "</div>" +

      (p.heroImage
        ? '<div class="case-study-hero-image-full">' +
          '<img class="case-study-hero__image" src="' +
          escapeHtml(p.heroImage) +
          '" alt="' +
          escapeHtml(p.title || "") +
          ' hero image" loading="eager">' +
          "</div>"
        : "") +

      '<div class="case-study-body">' +
      respBandHtml +
      sectionBandsHtml +
      videoBandHtml +
      "</div>";

    if (_initCanvas) {
      var heroCanvas = container.querySelector(".case-study-hero .section__canvas");
      if (heroCanvas) _initCanvas(heroCanvas);
    }

    if (_initReveal) {
      _initReveal(container);
    }
  }
   /* ------------------------------------------
   8. Video Embed Helper
     ------------------------------------------ */
  function buildVideoEmbed(url) {
    if (!url || url.trim() === "") return "";

    let embedUrl = url.trim();

    // YouTube
    const ytMatch = embedUrl.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    if (ytMatch) {
      embedUrl =
        "https://www.youtube.com/embed/" + ytMatch[1] + "?rel=0&modestbranding=1";
    }

    // Vimeo
    const vimeoMatch = embedUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      embedUrl = "https://player.vimeo.com/video/" + vimeoMatch[1];
    }

    return (
      '<div class="video-container">' +
      '<iframe src="' +
      escapeHtml(embedUrl) +
      '" title="Project video walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>' +
      "</div>"
    );
  }

  /* ------------------------------------------
     9. Contact Form Validation
     ------------------------------------------ */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const successMsg = document.getElementById("form-success");

    function showError(fieldId, message) {
      const field = document.getElementById(fieldId);
      const errEl = document.getElementById(fieldId + "-error");
      if (field) field.classList.add("is-invalid");
      if (errEl) {
        errEl.textContent = message;
        errEl.style.display = "block";
      }
    }

    function clearError(fieldId) {
      const field = document.getElementById(fieldId);
      const errEl = document.getElementById(fieldId + "-error");
      if (field) field.classList.remove("is-invalid");
      if (errEl) errEl.style.display = "none";
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Live validation on blur
    ["contact-name", "contact-email", "contact-message"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("blur", function () {
          validateField(id);
        });
        el.addEventListener("input", function () {
          if (el.classList.contains("is-invalid")) validateField(id);
        });
      }
    });

    function validateField(id) {
      const el = document.getElementById(id);
      if (!el) return true;
      const val = el.value.trim();

      if (id === "contact-name") {
        if (!val) {
          showError(id, "Name is required.");
          return false;
        }
        clearError(id);
        return true;
      }
      if (id === "contact-email") {
        if (!val) {
          showError(id, "Email address is required.");
          return false;
        }
        if (!validateEmail(val)) {
          showError(id, "Please enter a valid email address.");
          return false;
        }
        clearError(id);
        return true;
      }
      if (id === "contact-message") {
        if (!val) {
          showError(id, "Message is required.");
          return false;
        }
        if (val.length < 10) {
          showError(id, "Please enter a message of at least 10 characters.");
          return false;
        }
        clearError(id);
        return true;
      }
      return true;
    }

    var FORMSPREE_ENDPOINT = "https://formspree.io/f/meevboze";

    var errorMsg = document.getElementById("form-error");
    var submitBtn = contactForm.querySelector('[type="submit"]');

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var nameOk = validateField("contact-name");
      var emailOk = validateField("contact-email");
      var msgOk = validateField("contact-message");

      if (!nameOk || !emailOk || !msgOk) {
        // Focus first invalid field
        var firstInvalid = contactForm.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Disable button and show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }
      if (errorMsg) errorMsg.style.display = "none";

      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (response.ok) {
            if (successMsg) {
              successMsg.classList.add("visible");
              successMsg.setAttribute("role", "alert");
              contactForm.reset();
              successMsg.focus();
            }
          } else {
            if (errorMsg) {
              errorMsg.style.display = "block";
              errorMsg.focus();
            }
          }
        })
        .catch(function () {
          if (errorMsg) {
            errorMsg.style.display = "block";
            errorMsg.focus();
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
          }
        });
    });
  }
  /* ------------------------------------------
     10. Back to Top Button
     ------------------------------------------ */
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    const toggleBackToTop = function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    };

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* ------------------------------------------
     11. Scroll Reveal
     ------------------------------------------ */
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.1 // trigger earlier for large full-width bands on all pages
    }
  );

  document.querySelectorAll(".reveal").forEach(function (element) {
    revealObserver.observe(element);
  });

  // Expose so dynamically-rendered content (e.g. case study) can register its own .reveal elements.
  _initReveal = function (container) {
    container.querySelectorAll(".reveal").forEach(function (element) {
      revealObserver.observe(element);
    });
  };
  /* ------------------------------------------
     12. Wireframe Canvas Animation
     ------------------------------------------ */
  (function initWireframeCanvas() {
    var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    var STROKE_COLORS = [
      "#6F7D5A", // sage green
      "#556047", // dark sage
      "#7A6055", // warm brown
      "#C26A4A", // terra cotta
      "#A89880", // warm tan
    ];

    var KEYWORDS = [
      "wireframe", "prototype", "mockup", "user flow", "sitemap",
      "UX research", "persona", "journey map", "heuristics", "usability",
      "information architecture", "style guide", "component", "accessibility",
      "content strategy", "documentation", "taxonomy", "responsive design",
      "design system", "affinity map", "task analysis", "card sort",
      "A/B test", "visual hierarchy", "navigation", "interaction design",
      "annotation", "specification", "user story", "low-fidelity",
      "high-fidelity", "content audit", "layout grid", "typography",
      "function()", "const", "async / await", "API", "SQL", "Python",
      "JavaScript", "algorithm", "for loop", "array", "database",
      "debugging", "refactoring", "recursion", "version control",
      "machine learning", "data pipeline", "regression", "neural network",
      "git commit", "pull request", "REST API", "JSON", "data structure",
    ];

    var TYPES = [
      "browser", "mobile", "card", "nav", "form",
      "button", "textblock", "imagebox", "avatar", "keyword",
      "barchart", "linechart", "piechart", "datatable", "dashboard", "funnel",
      "terminal", "codeblock", "gitgraph", "database", "flowchart", "scatterplot",
      "codetag", "curlycode", "laptop",
    ];

    var MAX_ELEMENTS = 20;
    var KEYWORD_FONT_FAMILY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

    function rand(min, max) { return min + Math.random() * (max - min); }
    function randInt(min, max) { return Math.floor(rand(min, max)); }

    /* ---- rounded-rect path helper (polyfill for older browsers) ---- */
    function rrect(ctx, x, y, w, h, r) {
      var rr = Math.min(r, w / 2, h / 2);
      ctx.moveTo(x + rr, y);
      ctx.lineTo(x + w - rr, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
      ctx.lineTo(x + w, y + h - rr);
      ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      ctx.lineTo(x + rr, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
      ctx.lineTo(x, y + rr);
      ctx.quadraticCurveTo(x, y, x + rr, y);
      ctx.closePath();
    }

    /* ---- draw helpers ---- */
    function drawBrowser(ctx, s) {
      var w = 110 * s, h = 76 * s, bh = 13 * s;
      ctx.beginPath(); rrect(ctx, -w / 2, -h / 2, w, h, 4 * s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + bh); ctx.lineTo(w / 2, -h / 2 + bh); ctx.stroke();
      [-w / 2 + 7 * s, -w / 2 + 14 * s, -w / 2 + 21 * s].forEach(function (dx) {
        ctx.beginPath(); ctx.arc(dx, -h / 2 + bh / 2, 2.2 * s, 0, Math.PI * 2); ctx.stroke();
      });
      var ly = -h / 2 + bh + 9 * s;
      [0.75, 0.9, 0.55, 0.82].forEach(function (p) {
        if (ly < h / 2 - 6 * s) {
          ctx.beginPath(); ctx.moveTo(-w / 2 + 7 * s, ly); ctx.lineTo(-w / 2 + 7 * s + (w - 14 * s) * p, ly); ctx.stroke();
          ly += 9 * s;
        }
      });
    }

    function drawMobile(ctx, s) {
      var w = 46 * s, h = 84 * s;
      ctx.beginPath(); rrect(ctx, -w / 2, -h / 2, w, h, 7 * s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-w / 2 + 4 * s, -h / 2 + 11 * s); ctx.lineTo(w / 2 - 4 * s, -h / 2 + 11 * s); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, h / 2 - 8 * s, 4.5 * s, 0, Math.PI * 2); ctx.stroke();
      var ly = -h / 2 + 19 * s;
      [0.8, 0.6, 0.9, 0.5, 0.72].forEach(function (p) {
        ctx.beginPath(); ctx.moveTo(-w / 2 + 5 * s, ly); ctx.lineTo(-w / 2 + 5 * s + (w - 10 * s) * p, ly); ctx.stroke();
        ly += 9 * s;
      });
    }

    function drawCard(ctx, s) {
      var w = 96 * s, h = 68 * s, imgH = 28 * s, pad = 4 * s;
      ctx.beginPath(); rrect(ctx, -w / 2, -h / 2, w, h, 4 * s); ctx.stroke();
      ctx.beginPath(); ctx.rect(-w / 2 + pad, -h / 2 + pad, w - 2 * pad, imgH); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-w / 2 + pad, -h / 2 + pad); ctx.lineTo(w / 2 - pad, -h / 2 + pad + imgH);
      ctx.moveTo(w / 2 - pad, -h / 2 + pad); ctx.lineTo(-w / 2 + pad, -h / 2 + pad + imgH);
      ctx.stroke();
      var ly = -h / 2 + imgH + 9 * s;
      [0.72, 0.52].forEach(function (p) {
        ctx.beginPath(); ctx.moveTo(-w / 2 + 7 * s, ly); ctx.lineTo(-w / 2 + 7 * s + (w - 14 * s) * p, ly); ctx.stroke();
        ly += 9 * s;
      });
    }

    function drawNav(ctx, s) {
      var w = 126 * s, h = 20 * s;
      ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.stroke();
      ctx.beginPath(); ctx.rect(-w / 2 + 3 * s, -h / 2 + 3 * s, 22 * s, h - 6 * s); ctx.stroke();
      var nx = w / 2 - 10 * s;
      [0, 1, 2, 3].forEach(function () {
        ctx.beginPath();
        ctx.moveTo(nx - 8 * s, -3 * s); ctx.lineTo(nx, -3 * s);
        ctx.moveTo(nx - 8 * s, 3 * s); ctx.lineTo(nx, 3 * s);
        ctx.stroke(); nx -= 17 * s;
      });
    }

    function drawForm(ctx, s) {
      var fw = 94 * s, pad = 4 * s;
      var ly = -(3 * 22 * s) / 2;
      [1, 0.85, 0.7].forEach(function (p) {
        ctx.beginPath(); ctx.moveTo(-fw / 2 + pad, ly); ctx.lineTo(-fw / 2 + pad + fw * 0.38, ly); ctx.stroke();
        ly += 6 * s;
        ctx.beginPath(); rrect(ctx, -fw / 2 + pad, ly, fw * p - pad, 13 * s, 2 * s); ctx.stroke();
        ly += 17 * s;
      });
      ctx.beginPath(); rrect(ctx, -fw / 2 + pad, ly, 38 * s, 11 * s, 3 * s); ctx.stroke();
    }

    function drawButton(ctx, s) {
      var w = 68 * s, h = 21 * s;
      ctx.beginPath(); rrect(ctx, -w / 2, -h / 2, w, h, 5 * s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-18 * s, 0); ctx.lineTo(18 * s, 0); ctx.stroke();
    }

    function drawTextBlock(ctx, s) {
      var w = 116 * s;
      var pcts = [1.0, 0.84, 0.94, 0.58, 0.9, 0.73, 0.42];
      var ly = -(pcts.length * 9 * s) / 2;
      pcts.forEach(function (p) {
        ctx.beginPath(); ctx.moveTo(-w / 2, ly); ctx.lineTo(-w / 2 + w * p, ly); ctx.stroke();
        ly += 9 * s;
      });
    }

    function drawImageBox(ctx, s) {
      var w = 88 * s, h = 58 * s;
      ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(w / 2, h / 2);
      ctx.moveTo(w / 2, -h / 2); ctx.lineTo(-w / 2, h / 2);
      ctx.stroke();
    }

    function drawAvatar(ctx, s) {
      var r = 26 * s;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -r * 0.24, r * 0.34, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, r * 0.48, r * 0.54, Math.PI, 0); ctx.stroke();
    }

    function drawKeyword(ctx, el) {
      var s = el.size;
      var kw = el.keyword;
      var fontSize = Math.round(10 * s) + "px";
      ctx.font = "600 " + fontSize + " " + KEYWORD_FONT_FAMILY;
      var tw = ctx.measureText(kw).width;
      var th = 10 * s;
      var pad = 5 * s;
      ctx.beginPath(); rrect(ctx, -tw / 2 - pad, -th / 2 - pad * 0.6, tw + pad * 2, th + pad * 1.2, 3 * s); ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(kw, 0, 0);
    }

    function drawBarChart(ctx, s) {
      var w = 100 * s, h = 68 * s, pad = 6 * s;
      ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.stroke();
      var bars = [0.55, 0.85, 0.40, 0.70, 0.95, 0.60];
      var bw = (w - 2 * pad) / bars.length - 2 * s;
      var bx = -w / 2 + pad;
      bars.forEach(function (p) {
        var bh = (h - 2 * pad) * p;
        ctx.beginPath(); ctx.rect(bx, h / 2 - pad - bh, bw, bh); ctx.stroke();
        bx += bw + 2 * s;
      });
    }

    function drawLineChart(ctx, s) {
      var w = 104 * s, h = 66 * s, pad = 8 * s;
      ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.stroke();
      var pts = [0.4, 0.65, 0.35, 0.80, 0.55, 0.90, 0.60];
      var step = (w - 2 * pad) / (pts.length - 1);
      ctx.beginPath();
      pts.forEach(function (p, i) {
        var px = -w / 2 + pad + i * step;
        var py = h / 2 - pad - (h - 2 * pad) * p;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      pts.forEach(function (p, i) {
        var px = -w / 2 + pad + i * step;
        var py = h / 2 - pad - (h - 2 * pad) * p;
        ctx.beginPath(); ctx.arc(px, py, 2.5 * s, 0, Math.PI * 2); ctx.stroke();
      });
    }

    function drawPieChart(ctx, s) {
      var r = 30 * s;
      var slices = [0.30, 0.22, 0.18, 0.15, 0.15];
      var start = -Math.PI / 2;
      slices.forEach(function (p) {
        var end = start + p * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, start, end); ctx.closePath(); ctx.stroke();
        start = end;
      });
    }

    function drawDataTable(ctx, s) {
      var w = 110 * s, h = 72 * s, rowH = 12 * s, pad = 5 * s;
      ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.stroke();
      var cols = [-w / 2 + w * 0.35, -w / 2 + w * 0.62];
      cols.forEach(function (cx) {
        ctx.beginPath(); ctx.moveTo(cx, -h / 2); ctx.lineTo(cx, h / 2); ctx.stroke();
      });
      var ry = -h / 2 + rowH;
      while (ry < h / 2) {
        ctx.beginPath(); ctx.moveTo(-w / 2, ry); ctx.lineTo(w / 2, ry); ctx.stroke();
        ry += rowH;
      }
      [0.80, 0.60, 0.90].forEach(function (p, i) {
        var tx = -w / 2 + pad;
        var ty = -h / 2 + rowH * 0.6;
        ctx.beginPath(); ctx.moveTo(tx, ty + rowH * i * 1.1); ctx.lineTo(tx + (w * 0.32) * p, ty + rowH * i * 1.1); ctx.stroke();
      });
    }

    function drawDashboard(ctx, s) {
      var w = 116 * s, h = 78 * s, pad = 5 * s;
      ctx.beginPath(); rrect(ctx, -w / 2, -h / 2, w, h, 4 * s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + 14 * s); ctx.lineTo(w / 2, -h / 2 + 14 * s); ctx.stroke();
      var hw = w / 2 - pad * 1.5, hh = (h - 18 * s - pad * 2) / 2 - pad / 2;
      ctx.beginPath(); rrect(ctx, -w / 2 + pad, -h / 2 + 18 * s, hw, hh, 3 * s); ctx.stroke();
      ctx.beginPath(); rrect(ctx, pad / 2, -h / 2 + 18 * s, hw, hh, 3 * s); ctx.stroke();
      ctx.beginPath(); rrect(ctx, -w / 2 + pad, -h / 2 + 18 * s + hh + pad, w - 2 * pad, hh, 3 * s); ctx.stroke();
    }

    function drawFunnel(ctx, s) {
      var layers = [1.0, 0.78, 0.56, 0.36, 0.18];
      var maxW = 90 * s, lh = 12 * s;
      var ty = -(layers.length * lh) / 2;
      layers.forEach(function (p, i) {
        var lw = maxW * p;
        ctx.beginPath(); ctx.rect(-lw / 2, ty + i * lh, lw, lh - 1 * s); ctx.stroke();
      });
    }

    function drawTerminal(ctx, s) {
      var w = 110 * s, h = 76 * s, bh = 13 * s;
      ctx.beginPath(); rrect(ctx, -w / 2, -h / 2, w, h, 4 * s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + bh); ctx.lineTo(w / 2, -h / 2 + bh); ctx.stroke();
      [-w / 2 + 7 * s, -w / 2 + 14 * s, -w / 2 + 21 * s].forEach(function (dx) {
        ctx.beginPath(); ctx.arc(dx, -h / 2 + bh / 2, 2.2 * s, 0, Math.PI * 2); ctx.stroke();
      });
      var ly = -h / 2 + bh + 10 * s;
      var indents = [0, 1, 1, 2, 1, 0];
      var pcts   = [0.30, 0.60, 0.45, 0.55, 0.70, 0.35];
      pcts.forEach(function (p, i) {
        if (ly < h / 2 - 5 * s) {
          var ix = -w / 2 + 8 * s + indents[i] * 9 * s;
          // prompt marker on first column of each non-indented line
          if (indents[i] === 0) {
            ctx.beginPath();
            ctx.moveTo(ix, ly); ctx.lineTo(ix + 4 * s, ly);
            ctx.stroke();
            ix += 6 * s;
          }
          ctx.beginPath(); ctx.moveTo(ix, ly); ctx.lineTo(ix + (w - 22 * s) * p, ly); ctx.stroke();
          ly += 10 * s;
        }
      });
    }

    function drawCodeBlock(ctx, s) {
      var w = 110 * s, h = 80 * s, bh = 11 * s, gutter = 14 * s, pad = 5 * s;
      ctx.beginPath(); rrect(ctx, -w / 2, -h / 2, w, h, 4 * s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2 + bh); ctx.lineTo(w / 2, -h / 2 + bh); ctx.stroke();
      var gutterX = -w / 2 + gutter;
      ctx.beginPath(); ctx.moveTo(gutterX, -h / 2 + bh); ctx.lineTo(gutterX, h / 2 - 2 * s); ctx.stroke();
      var ly = -h / 2 + bh + 9 * s;
      var indents = [0, 1, 2, 2, 1, 2, 0, 1];
      var pcts   = [0.55, 0.70, 0.50, 0.45, 0.65, 0.40, 0.60, 0.35];
      pcts.forEach(function (p, i) {
        if (ly < h / 2 - 6 * s) {
          var ix = gutterX + pad + indents[i] * 7 * s;
          ctx.beginPath(); ctx.moveTo(ix, ly); ctx.lineTo(ix + (w - gutter - pad * 2) * p, ly); ctx.stroke();
          ly += 9 * s;
        }
      });
    }

    function drawGitGraph(ctx, s) {
      var mainY = 6 * s, branchY = -16 * s;
      var commits = [
        { x: -44 * s, y: mainY },
        { x: -24 * s, y: mainY },
        { x: -4 * s,  y: branchY },
        { x: 16 * s,  y: branchY },
        { x: 26 * s,  y: mainY },
        { x: 46 * s,  y: mainY },
      ];
      // main branch line
      ctx.beginPath();
      ctx.moveTo(commits[0].x, mainY); ctx.lineTo(commits[5].x, mainY);
      ctx.stroke();
      // branch-off and merge lines
      ctx.beginPath();
      ctx.moveTo(commits[1].x, mainY);
      ctx.lineTo(commits[2].x, branchY);
      ctx.lineTo(commits[3].x, branchY);
      ctx.lineTo(commits[4].x, mainY);
      ctx.stroke();
      // commit circles
      commits.forEach(function (c) {
        ctx.beginPath(); ctx.arc(c.x, c.y, 3.5 * s, 0, Math.PI * 2); ctx.stroke();
      });
    }

    function drawDatabase(ctx, s) {
      var rx = 36 * s, ry = 8 * s, bodyH = 56 * s;
      var topY  = -bodyH / 2;
      var midY1 = topY + bodyH * 0.33;
      var midY2 = topY + bodyH * 0.66;
      var botY  = topY + bodyH;
      // side walls
      ctx.beginPath(); ctx.moveTo(-rx, topY + ry); ctx.lineTo(-rx, botY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo( rx, topY + ry); ctx.lineTo( rx, botY); ctx.stroke();
      // bottom ellipse
      ctx.beginPath(); ctx.ellipse(0, botY, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
      // mid dividers (lower half arc only to simulate depth)
      ctx.beginPath(); ctx.ellipse(0, midY1, rx, ry, 0, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, midY2, rx, ry, 0, 0, Math.PI); ctx.stroke();
      // top ellipse
      ctx.beginPath(); ctx.ellipse(0, topY, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    }

    function drawFlowchart(ctx, s) {
      var bw = 72 * s, bh = 13 * s, dh = 17 * s, gap = 7 * s;
      var totalH = bh + gap + dh * 2 + gap + bh;
      var top = -totalH / 2;
      // top box
      ctx.beginPath(); rrect(ctx, -bw / 2, top, bw, bh, 3 * s); ctx.stroke();
      // arrow down to diamond
      ctx.beginPath(); ctx.moveTo(0, top + bh); ctx.lineTo(0, top + bh + gap); ctx.stroke();
      // diamond
      var dy = top + bh + gap;
      ctx.beginPath();
      ctx.moveTo(0, dy); ctx.lineTo(bw / 2, dy + dh); ctx.lineTo(0, dy + dh * 2); ctx.lineTo(-bw / 2, dy + dh);
      ctx.closePath(); ctx.stroke();
      // arrow down to bottom box
      var bottomY = dy + dh * 2;
      ctx.beginPath(); ctx.moveTo(0, bottomY); ctx.lineTo(0, bottomY + gap); ctx.stroke();
      // bottom box
      ctx.beginPath(); rrect(ctx, -bw / 2, bottomY + gap, bw, bh, 3 * s); ctx.stroke();
      // side branch label line from diamond
      ctx.beginPath();
      ctx.moveTo(bw / 2, dy + dh);
      ctx.lineTo(bw / 2 + 12 * s, dy + dh);
      ctx.lineTo(bw / 2 + 12 * s, bottomY + gap + bh / 2);
      ctx.lineTo(bw / 2, bottomY + gap + bh / 2);
      ctx.stroke();
    }

    function drawCodeTag(ctx, s) {
      var fontSize = Math.round(22 * s) + "px";
      ctx.font = "700 " + fontSize + " " + KEYWORD_FONT_FAMILY;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("</>" , 0, 0);
    }

    function drawCurlyCode(ctx, s) {
      var fontSize = Math.round(13 * s) + "px";
      ctx.font = "700 " + fontSize + " " + KEYWORD_FONT_FAMILY;
      var text = "{ Code }";
      var tw = ctx.measureText(text).width;
      var th = 13 * s;
      var pad = 5 * s;
      ctx.beginPath(); rrect(ctx, -tw / 2 - pad, -th / 2 - pad * 0.6, tw + pad * 2, th + pad * 1.2, 3 * s); ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 0, 0);
    }

    function drawLaptop(ctx, s) {
      var sw = 96 * s, sh = 62 * s, basePad = 6 * s;
      // screen body
      ctx.beginPath(); rrect(ctx, -sw / 2, -sh / 2, sw, sh, 4 * s); ctx.stroke();
      // inner screen bezel
      var bz = 6 * s;
      ctx.beginPath(); ctx.rect(-sw / 2 + bz, -sh / 2 + bz, sw - 2 * bz, sh - 2 * bz); ctx.stroke();
      // simple code lines inside screen
      var ly = -sh / 2 + bz + 8 * s;
      [0.6, 0.8, 0.5, 0.7].forEach(function (p) {
        if (ly < sh / 2 - bz - 4 * s) {
          ctx.beginPath(); ctx.moveTo(-sw / 2 + bz + 4 * s, ly); ctx.lineTo(-sw / 2 + bz + 4 * s + (sw - 2 * bz - 8 * s) * p, ly); ctx.stroke();
          ly += 9 * s;
        }
      });
      // base / hinge line
      var baseY = sh / 2;
      ctx.beginPath(); ctx.moveTo(-sw / 2 - basePad, baseY); ctx.lineTo(sw / 2 + basePad, baseY); ctx.stroke();
      // base keyboard surface
      ctx.beginPath(); rrect(ctx, -sw / 2 - basePad, baseY, sw + 2 * basePad, 7 * s, 2 * s); ctx.stroke();
      // trackpad
      ctx.beginPath(); rrect(ctx, -14 * s, baseY + 1.5 * s, 28 * s, 4 * s, 1.5 * s); ctx.stroke();
    }

    function drawScatterplot(ctx, s) {
      var w = 96 * s, h = 70 * s, pad = 8 * s;
      ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.stroke();
      // y-axis
      ctx.beginPath(); ctx.moveTo(-w / 2 + pad, -h / 2 + pad); ctx.lineTo(-w / 2 + pad, h / 2 - pad); ctx.stroke();
      // x-axis
      ctx.beginPath(); ctx.moveTo(-w / 2 + pad, h / 2 - pad); ctx.lineTo(w / 2 - pad, h / 2 - pad); ctx.stroke();
      // scatter points (normalised 0–1 within plot area)
      var pts = [
        [0.15, 0.70], [0.30, 0.50], [0.45, 0.80], [0.20, 0.35],
        [0.60, 0.65], [0.50, 0.42], [0.75, 0.88], [0.10, 0.55],
        [0.65, 0.30], [0.85, 0.75], [0.38, 0.60],
      ];
      var aw = w - 2 * pad, ah = h - 2 * pad;
      pts.forEach(function (p) {
        var px = -w / 2 + pad + aw * p[0];
        var py =  h / 2 - pad - ah * p[1];
        ctx.beginPath(); ctx.arc(px, py, 2.5 * s, 0, Math.PI * 2); ctx.stroke();
      });
    }

    /* ---- element factory ---- */
    /* zones: optional array of [xMin_fraction, xMax_fraction] pairs.
       When provided, x is picked randomly from one of those fractional bands.
       Used by the hero canvas so illustrations appear on the left edge and
       right half but not directly behind the text content. */
    function spawnElement(cw, ch, zones) {
      var type = TYPES[randInt(0, TYPES.length)];
      var color = STROKE_COLORS[randInt(0, STROKE_COLORS.length)];
      var x;
      if (zones && zones.length > 0) {
        var zone = zones[randInt(0, zones.length)];
        x = rand(cw * zone[0], cw * zone[1]);
      } else {
        x = rand(0, cw);
      }
      return {
        type: type,
        x: x,
        y: rand(-150, ch + 150),
        vx: rand(-0.28, 0.28),
        vy: rand(0.18, 0.55),
        angle: rand(-0.06, 0.06),
        spin: rand(-0.003, 0.003),
        color: color,
        life: 0,
        maxLife: Math.round(rand(350, 650)),
        size: rand(0.65, 1.0),
        keyword: KEYWORDS[randInt(0, KEYWORDS.length)],
      };
    }

    function drawElement(ctx, el, maxAlpha) {
      var t = el.life / el.maxLife;
      var alpha;
      if (t < 0.08)       { alpha = (t / 0.08) * maxAlpha; }
      else if (t > 0.85)  { alpha = ((1 - t) / 0.15) * maxAlpha; }
      else                { alpha = maxAlpha; }
      if (alpha <= 0) return;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = el.color;
      ctx.lineWidth = Math.max(0.8, 1.1 * el.size);
      ctx.translate(el.x, el.y);
      ctx.rotate(el.angle);

      switch (el.type) {
        case "browser":    drawBrowser(ctx, el.size);    break;
        case "mobile":     drawMobile(ctx, el.size);     break;
        case "card":       drawCard(ctx, el.size);       break;
        case "nav":        drawNav(ctx, el.size);        break;
        case "form":       drawForm(ctx, el.size);       break;
        case "button":     drawButton(ctx, el.size);     break;
        case "textblock":  drawTextBlock(ctx, el.size);  break;
        case "imagebox":   drawImageBox(ctx, el.size);   break;
        case "avatar":     drawAvatar(ctx, el.size);     break;
        case "keyword":    drawKeyword(ctx, el);         break;
        case "barchart":    drawBarChart(ctx, el.size);    break;
        case "linechart":   drawLineChart(ctx, el.size);   break;
        case "piechart":    drawPieChart(ctx, el.size);    break;
        case "datatable":   drawDataTable(ctx, el.size);   break;
        case "dashboard":   drawDashboard(ctx, el.size);   break;
        case "funnel":      drawFunnel(ctx, el.size);      break;
        case "terminal":    drawTerminal(ctx, el.size);    break;
        case "codeblock":   drawCodeBlock(ctx, el.size);   break;
        case "gitgraph":    drawGitGraph(ctx, el.size);    break;
        case "database":    drawDatabase(ctx, el.size);    break;
        case "flowchart":   drawFlowchart(ctx, el.size);   break;
        case "scatterplot": drawScatterplot(ctx, el.size); break;
        case "codetag":     drawCodeTag(ctx, el.size);     break;
        case "curlycode":   drawCurlyCode(ctx, el.size);   break;
        case "laptop":      drawLaptop(ctx, el.size);      break;
      }

      ctx.restore();
    }

    /* ---- canvas loop ---- */
    /* zones: optional spawn-zone array forwarded to spawnElement (see above). */
    function initCanvas(canvas, zones) {
      var ctx = canvas.getContext("2d");
      var maxAlpha = 0.45;
      var elements = [];
      var frame = 0;
      var rafId;

      function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }

      function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (frame % 6 === 0 && elements.length < MAX_ELEMENTS) {
          elements.push(spawnElement(canvas.width, canvas.height, zones));
        }

        var alive = [];
        for (var i = 0; i < elements.length; i++) {
          var el = elements[i];
          el.life++;
          if (el.life >= el.maxLife) continue;
          el.x += el.vx;
          el.y += el.vy;
          el.angle += el.spin;
          drawElement(ctx, el, maxAlpha);
          alive.push(el);
        }
        elements = alive;

        frame++;
        rafId = requestAnimationFrame(tick);
      }

      resize();
      window.addEventListener("resize", resize, { passive: true });

      // Pre-populate so elements are visible immediately on load.
      // Start life between 8%–45% of maxLife so they are past the fade-in
      // ramp and spread across various stages of their lifespan.
      var preCount = Math.min(8, MAX_ELEMENTS);
      for (var p = 0; p < preCount; p++) {
        var el = spawnElement(canvas.width, canvas.height, zones);
        el.life = Math.round(rand(el.maxLife * 0.08, el.maxLife * 0.45));
        elements.push(el);
      }

      rafId = requestAnimationFrame(tick);

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          if (rafId) cancelAnimationFrame(rafId);
        } else {
          frame = 0;
          rafId = requestAnimationFrame(tick);
        }
      });

      motionQuery.addEventListener("change", function (e) {
        if (e.matches) {
          if (rafId) cancelAnimationFrame(rafId);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          rafId = requestAnimationFrame(tick);
        }
      });
    }

    var canvases = document.querySelectorAll(".hero__canvas, .section__canvas");
    for (var c = 0; c < canvases.length; c++) {
      var isHero = canvases[c].classList.contains("hero__canvas");
      // Hero canvas: bias illustrations to the left-edge strip and right half,
      // keeping the center-left text area free. Extra right-side entries boost
      // motion-graphic density on the right of the image.
      var heroZones = [[0, 0.22], [0.50, 1.0], [0.50, 1.0], [0.50, 1.0]]; // left:right:right:right = 1:3 weighting
      initCanvas(canvases[c], isHero ? heroZones : null);
    }

    // Expose for use by renderCaseStudy after dynamic content injection
    _initCanvas = initCanvas;
  })();

  /* ------------------------------------------
     Hero image: selective recolor in moon-mode
     – Shirt: shifts olive/yellow-green pixels (~36–80° hue) to blue (~194–240°)
     – Background: shifts blue-gray pixels (~180–270° hue) to pink (~328°)
     Face, hair, and near-black shadows are left unchanged.
     ------------------------------------------ */
  (function () {
    var heroImg = document.querySelector(".hero__image img");
    if (!heroImg) return;

    var originalSrc = heroImg.getAttribute("src");
    var moonSrc = null;
    var currentMode = "sun";
    var MOON_CLASS = "moon-mode";

    // Shared thresholds
    var MIN_DELTA     = 0.02;  // minimum channel spread to skip near-gray pixels
    var MIN_VAL       = 0.08;  // minimum brightness to skip near-black pixels

    // Shirt thresholds: olive/army-green range (hue 36°–80°)
    // Face skin tones sit at 0–32° so they are excluded.
    var SHIRT_HUE_MIN = 0.10;  // 36°
    var SHIRT_HUE_MAX = 0.22;  // 80°
    var SHIRT_SAT_MIN = 0.10;  // exclude near-neutral olive shadows
    var HUE_SHIFT     = 0.44;  // ~158° shift: moves olive (36–80°) to blue (194–238°)

    // Background thresholds: blue-gray range (hue 180°–300°)
    var BG_HUE_MIN      = 0.50;  // 180°
    var BG_HUE_MAX      = 0.83;  // 300° – extended to capture indigo/violet-blue splotches
    var BG_SAT_MIN      = 0.03;  // catch lightly-tinted blue-gray pixels
    var BG_HUE_TARGET   = 0.91;  // 328° – rose-pink target hue
    var BG_SAT_MIN_OUT  = 0.15;  // boost saturation so the pink is visible

    function hsvToRgb(h, s, v) {
      var i = Math.floor(h * 6);
      var f = h * 6 - i;
      var p = v * (1 - s);
      var q = v * (1 - f * s);
      var t = v * (1 - (1 - f) * s);
      var r, g, b;
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        default: r = v; g = p; b = q; break;
      }
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function buildMoonModeSrc(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;
      var len = data.length;

      for (var i = 0; i < len; i += 4) {
        var r = data[i] / 255;
        var g = data[i + 1] / 255;
        var b = data[i + 2] / 255;
        var max = r > g ? (r > b ? r : b) : (g > b ? g : b);
        var min = r < g ? (r < b ? r : b) : (g < b ? g : b);
        var delta = max - min;
        // Skip near-gray or near-black pixels
        if (delta < MIN_DELTA || max < MIN_VAL) continue;

        var hue;
        if (max === r) {
          hue = ((g - b) / delta + 6) % 6;
        } else if (max === g) {
          hue = (b - r) / delta + 2;
        } else {
          hue = (r - g) / delta + 4;
        }
        hue /= 6;
        var sat = delta / max;

        if (hue >= SHIRT_HUE_MIN && hue <= SHIRT_HUE_MAX && sat >= SHIRT_SAT_MIN) {
          // Shift olive shirt pixels to blue
          var newHue = hue + HUE_SHIFT;
          if (newHue >= 1) newHue -= 1;
          var rgb = hsvToRgb(newHue, sat, max);
          data[i]     = rgb[0];
          data[i + 1] = rgb[1];
          data[i + 2] = rgb[2];
        } else if (hue >= BG_HUE_MIN && hue <= BG_HUE_MAX && sat >= BG_SAT_MIN) {
          // Shift blue-gray background pixels to pink
          var satOut = Math.max(sat, BG_SAT_MIN_OUT);
          var rgb = hsvToRgb(BG_HUE_TARGET, satOut, max);
          data[i]     = rgb[0];
          data[i + 1] = rgb[1];
          data[i + 2] = rgb[2];
        }
      }

      ctx.putImageData(imageData, 0, 0);
      // Source image is JPEG so encode as JPEG to match format (no transparency)
      return canvas.toDataURL("image/jpeg", 0.92);
    }

    function syncShirtColor() {
      var isMoon = document.documentElement.classList.contains(MOON_CLASS);

      if (!isMoon) {
        if (currentMode !== "sun") {
          heroImg.src = originalSrc;
          currentMode = "sun";
        }
        return;
      }

      if (currentMode === "moon") return;

      if (moonSrc) {
        heroImg.src = moonSrc;
        currentMode = "moon";
        return;
      }

      if (heroImg.complete && heroImg.naturalWidth > 0) {
        moonSrc = buildMoonModeSrc(heroImg);
        heroImg.src = moonSrc;
        currentMode = "moon";
      } else {
        heroImg.addEventListener("load", function onLoad() {
          heroImg.removeEventListener("load", onLoad);
          if (document.documentElement.classList.contains(MOON_CLASS)) {
            moonSrc = buildMoonModeSrc(heroImg);
            heroImg.src = moonSrc;
            currentMode = "moon";
          }
        });
      }
    }

    window.heroSyncShirtColor = syncShirtColor;
  })();

  /* ------------------------------------------
     Theme Toggle: Sun / Moon
     ------------------------------------------ */
  (function () {
    var MOON_CLASS = "moon-mode";
    var STORAGE_KEY = "portfolio-theme";
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;

    function applyTheme(isMoon) {
      if (isMoon) {
        document.documentElement.classList.add(MOON_CLASS);
        btn.setAttribute("aria-label", "Switch to light mode");
      } else {
        document.documentElement.classList.remove(MOON_CLASS);
        btn.setAttribute("aria-label", "Switch to dark mode");
      }
      if (window.heroSyncShirtColor) window.heroSyncShirtColor();
    }

    var stored = localStorage.getItem(STORAGE_KEY);
    applyTheme(stored === "moon");

    btn.addEventListener("click", function () {
      var isMoon = !document.documentElement.classList.contains(MOON_CLASS);
      applyTheme(isMoon);
      localStorage.setItem(STORAGE_KEY, isMoon ? "moon" : "sun");
    });
  })();

})();
