document.documentElement.classList.add("js");

const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = nav.querySelectorAll("a");
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("[data-year]");
const hero = document.querySelector(".hero");
const ambientBackground = document.querySelector(".ambient-bg");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const projectVisuals = document.querySelectorAll(".project-card__visual");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const sectionNavLinks = [...navLinks].filter((link) => link.hash);
const sectionNavTargets = sectionNavLinks
  .map((link) => document.querySelector(link.hash))
  .filter(Boolean);

const setActiveSection = (sectionId) => {
  sectionNavLinks.forEach((link) => {
    const isActive = link.hash === `#${sectionId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
};

year.textContent = new Date().getFullYear();

const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
  body.classList.remove("menu-open");
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
  body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      .slice(0, 1)
      .forEach((entry) => setActiveSection(entry.target.id));
  },
  { rootMargin: "-38% 0px -48% 0px", threshold: [0, 0.1, 0.35, 0.6] },
);

sectionNavTargets.forEach((section) => sectionObserver.observe(section));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

if (reduceMotion.matches) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const parallaxItems = [
    { element: document.querySelector(".manifesto__title"), strength: -24 },
    { element: document.querySelector(".section-heading h2"), strength: -18 },
    { element: document.querySelector(".expertise__title"), strength: -18 },
    { element: document.querySelector(".experience__title"), strength: -16 },
    { element: document.querySelector(".contact__title"), strength: -14 },
  ].filter((item) => item.element);

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  let motionFrame = null;

  const updateScrollMotion = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;

    const heroProgress = Math.min(window.scrollY / window.innerHeight, 1);
    hero.style.setProperty("--hero-parallax", `${heroProgress * 28}px`);

    parallaxItems.forEach(({ element, strength }) => {
      const bounds = element.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;

      const elementCenter = bounds.top + bounds.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const distance = (elementCenter - viewportCenter) / window.innerHeight;
      element.style.setProperty("--parallax-y", `${distance * strength}px`);
    });

    motionFrame = null;
  };

  const requestScrollMotion = () => {
    if (motionFrame !== null) return;
    motionFrame = window.requestAnimationFrame(updateScrollMotion);
  };

  window.addEventListener("scroll", requestScrollMotion, { passive: true });
  window.addEventListener("resize", requestScrollMotion);
  updateScrollMotion();

  let pointerFrame = null;
  let pointerX = 0;
  let pointerY = 0;

  window.addEventListener("pointermove", (event) => {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 26;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 26;
    if (pointerFrame !== null) return;

    pointerFrame = window.requestAnimationFrame(() => {
      ambientBackground.style.setProperty("--ambient-x", `${pointerX}px`);
      ambientBackground.style.setProperty("--ambient-y", `${pointerY}px`);
      pointerFrame = null;
    });
  });

  projectVisuals.forEach((visual) => {
    visual.addEventListener("pointermove", (event) => {
      const bounds = visual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;

      visual.style.setProperty("--card-x", `${x * 100}%`);
      visual.style.setProperty("--card-y", `${y * 100}%`);
      visual.style.setProperty("--tilt-x", `${(0.5 - y) * 2.4}deg`);
      visual.style.setProperty("--tilt-y", `${(x - 0.5) * 2.4}deg`);
    });

    visual.addEventListener("pointerleave", () => {
      visual.style.setProperty("--card-x", "68%");
      visual.style.setProperty("--card-y", "30%");
      visual.style.setProperty("--tilt-x", "0deg");
      visual.style.setProperty("--tilt-y", "0deg");
    });
  });
}
