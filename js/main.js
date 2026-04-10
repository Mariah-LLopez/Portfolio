/* =============================================
   main.js — Mariah Lopez Portfolio
   ============================================= */

(function () {
  "use strict";

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
      ">View Case Study</a>" +
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

    const galleryHtml = (p.galleryImages || [])
      .map(function (img) {
        return (
          "<figure>" +
          '<img src="' +
          escapeHtml(img.src) +
          '" alt="' +
          escapeHtml(img.alt) +
          '" loading="lazy">' +
          "<figcaption>" +
          escapeHtml(img.alt) +
          "</figcaption>" +
          "</figure>"
        );
      })
      .join("");

    const linksHtml = (p.externalLinks || [])
      .map(function (l) {
        var href = l.url;
        if (!href && l.src) {
          console.warn("externalLinks entry uses deprecated \"src\" key; use \"url\" instead.", l);
          href = l.src;
        }
        return (
          '<a href="' +
          escapeHtml(href) +
          '" class="btn btn--outline" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(l.label) +
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
      { key: "outcomesAndNextSteps", label: "Outcomes & Next Steps" },
    ];

    const sectionsHtml = sections
      .filter(function (s) {
        return p[s.key];
      })
      .map(function (s) {
        return (
          '<section class="case-study-section" aria-labelledby="section-' +
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
          "</section>"
        );
      })
      .join("");

    container.innerHTML =
      // Hero
      '<div class="case-study-hero">' +
      '<div class="container">' +
      '<nav aria-label="Breadcrumb" style="margin-bottom:1rem;font-size:0.9375rem">' +
      '<a href="projects.html">← Back to Projects</a>' +
      "</nav>" +
      '<div class="case-study-hero__meta">' +
      '<span class="case-study-hero__role">' +
      escapeHtml(p.role) +
      "</span>" +
      '<div class="project-card__tags">' +
      tagsHtml +
      "</div>" +
      "</div>" +
      '<h1 class="case-study-hero__title">' +
      escapeHtml(p.title) +
      "</h1>" +
      '<p class="case-study-hero__summary">' +
      escapeHtml(p.strategicSummary) +
      "</p>" +
      (linksHtml
        ? '<div class="case-study-links">' + linksHtml + "</div>"
        : "") +
      '<img class="case-study-hero__image" src="' +
      escapeHtml(p.heroImage || "assets/placeholder.svg") +
      '" alt="' +
      escapeHtml(p.title) +
      ' hero image" loading="eager">' +
      "</div>" +
      "</div>" +
      // Body
      '<div class="case-study-body">' +
      '<div class="container" style="max-width:900px;margin-inline:auto">' +
      // Responsibilities & Tools sidebar block
      '<section class="case-study-section" aria-labelledby="section-responsibilities">' +
      '<h2 class="case-study-section__title" id="section-responsibilities">Responsibilities</h2>' +
      '<ul class="responsibilities-list">' +
      respHtml +
      "</ul>" +
      (toolsHtml
        ? '<h3 style="margin-top:1.5rem;margin-bottom:0.5rem;font-size:1rem;font-weight:700;color:var(--color-text)">Tools Used</h3>' +
          '<div class="tools-list">' +
          toolsHtml +
          "</div>"
        : "") +
      "</section>" +
      sectionsHtml +
      // Gallery
      (galleryHtml
        ? '<section class="case-study-section" aria-labelledby="section-gallery">' +
          '<h2 class="case-study-section__title" id="section-gallery">Project Gallery</h2>' +
          '<div class="case-study-gallery">' +
          galleryHtml +
          "</div>" +
          "</section>"
        : "") +
      // Video
      (videoHtml
        ? '<section class="case-study-section" aria-labelledby="section-video">' +
          '<h2 class="case-study-section__title" id="section-video">Video Walkthrough</h2>' +
          videoHtml +
          "</section>"
        : "") +
      "</div>" +
      "</div>";
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

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameOk = validateField("contact-name");
      const emailOk = validateField("contact-email");
      const msgOk = validateField("contact-message");

      if (!nameOk || !emailOk || !msgOk) {
        // Focus first invalid field
        const firstInvalid = contactForm.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulate submit success (no backend)
      if (successMsg) {
        successMsg.classList.add("visible");
        successMsg.setAttribute("role", "alert");
        contactForm.reset();
        successMsg.focus();
      }
    });
  }
   const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
   if (window.scrollY > 300) {
  backToTopBtn.classList.add("show");
} else {
  backToTopBtn.classList.remove("show");
}
})();
