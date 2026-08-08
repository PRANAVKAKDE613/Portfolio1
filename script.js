const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const progress = document.querySelector(".scroll-progress");
const themeToggle = document.querySelector(".theme-toggle");
const counters = document.querySelectorAll("[data-count]");
const navLinks = document.querySelectorAll(".nav a[href^='#']");
const revealItems = document.querySelectorAll(
  ".hero-copy, .hero-visual, .stats div, .project, .link-list a, .skill-group, .timeline article, .contact"
);

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "portfolio-theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
});

const updateProgress = () => {
  if (!progress) return;

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progress.style.width = `${Math.min(scrolled, 100)}%`;
};

const updateActiveLink = () => {
  const sections = [...document.querySelectorAll("section[id]")];
  const current = sections
    .filter((section) => section.offsetTop <= window.scrollY + 160)
    .pop();

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current?.id}`);
  });
};

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count || "0");
  const suffix = counter.dataset.suffix || "";
  const hasDecimal = !Number.isInteger(target);
  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const progressAmount = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progressAmount, 3);
    const value = target * eased;

    counter.textContent = `${hasDecimal ? value.toFixed(1) : Math.round(value)}${suffix}`;

    if (progressAmount < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

revealItems.forEach((item) => item.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      if (entry.target.matches("[data-count]") && !entry.target.dataset.animated) {
        entry.target.dataset.animated = "true";
        animateCounter(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal, [data-count], .project-visual").forEach((item) => {
  observer.observe(item);
});

window.addEventListener("scroll", () => {
  updateProgress();
  updateActiveLink();
});

window.addEventListener("resize", updateProgress);

updateProgress();
updateActiveLink();

// Project Tab Filtering Logic
const tabBtns = document.querySelectorAll(".project-tabs .tab-btn");
const projects = document.querySelectorAll(".project-grid .project");

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const selectedTab = btn.getAttribute("data-tab");

    tabBtns.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });

    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    projects.forEach((card) => {
      const category = card.getAttribute("data-category");
      if (selectedTab === "all" || category === selectedTab) {
        card.style.display = "flex";
        card.classList.add("is-visible");
      } else {
        card.style.display = "none";
      }
    });
  });
});

