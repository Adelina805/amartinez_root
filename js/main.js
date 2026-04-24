const THEME_STORAGE_KEY = "site-theme";

// THEME TOGGLE
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

// Determine the initial theme.
// Use the saved theme first, and if there isn't one,
// default to light mode before 6 PM and dark mode after 6 PM.
function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  const currentHour = new Date().getHours();
  return currentHour < 18 ? "light" : "dark";
}

// Toggle between light and dark themes
function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

// Scroll progress bar update
function updateScrollProgress() {
  const progressFill = document.querySelector(".scroll-progress-fill");
  if (!progressFill) {
    return;
  }
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress =
    scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0;

  progressFill.style.width = `${progress}%`;
}

// Mouse-following stars effect
const starsContainer = document.getElementById("stars-container");
const stars = [];
let mouseX = 0;
let mouseY = 0;

const STAR_SYMBOLS = ["✦", "✧"];
const MAX_STARS = 50; // Limit the number of stars on screen for performance

class Star {
  constructor(x, y) {
    this.element = document.createElement("span");
    this.element.className = "flying-star";
    this.element.textContent =
      STAR_SYMBOLS[Math.floor(Math.random() * STAR_SYMBOLS.length)];
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.life = 300; // milliseconds lifespan
    this.startTime = Date.now();
    this.vx = (Math.random() - 0.5) * 3; // random velocity
    this.vy = (Math.random() - 0.5) * 3;
    starsContainer.appendChild(this.element);
    stars.push(this);
  }

  update() {
    const elapsed = Date.now() - this.startTime;
    const progress = elapsed / this.life;

    // Move towards target with faster easing
    this.x += (this.targetX - this.x) * 0.35;
    this.y += (this.targetY - this.y) * 0.35;

    // Add more pronounced drift
    this.x += this.vx * 0.8;
    this.y += this.vy * 0.8;

    // Update opacity based on lifespan
    const opacity = Math.max(0, 1 - progress);
    this.element.style.opacity = opacity * 0.8;
    this.element.style.transform = `translate(${this.x}px, ${this.y}px) scale(${1 - progress * 0.6})`;

    return progress < 1;
  }
  remove() {
    starsContainer.removeChild(this.element);
  }
}
function createStar() {
  if (stars.length < MAX_STARS) {
    new Star(mouseX, mouseY);
  }
}
function updateStars() {
  for (let i = stars.length - 1; i >= 0; i--) {
    if (!stars[i].update()) {
      stars[i].remove();
      stars.splice(i, 1);
    }
  }
  requestAnimationFrame(updateStars);
}
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  createStar();
});
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getInitialTheme());
  updateScrollProgress();
  updateStars(); // Start the animation loop

  // PAGE LOAD ANIMATIONS
  // Rotate in spinning star
  const spinningstar = document.getElementById("spinning-star");
  if (spinningstar) {
    setTimeout(() => {
      spinningstar.classList.add("animate-in");
    }, 300);

    // SPINNING STAR PULSE ON CLICK
    spinningstar.addEventListener("click", () => {
      // Pulse using scale transition (doesn't interrupt spin animation)
      spinningstar.style.scale = "1.1";

      setTimeout(() => {
        spinningstar.style.scale = "1";
      }, 140);
    });
  }

  // MOBILE TOC
  const mobileToc = document.querySelector("[data-mobile-toc]");
  if (mobileToc) {
    const mobileBreakpoint = window.matchMedia("(max-width: 480px)");
    const toggleButton = mobileToc.querySelector(".timeline-toc-toggle");
    const tocPanel = mobileToc.querySelector(".timeline-toc-panel");
    const tocLinks = mobileToc.querySelectorAll('.toc-item[href^="#"]');
    const landingSection = document.getElementById("landing");
    const landingTitle = document.querySelector(".landing-title");
    let isOpen = false;

    // Set the open/closed state of the mobile TOC
    function setOpenState(nextOpen) {
      isOpen = nextOpen;
      mobileToc.classList.toggle("is-open", isOpen);

      if (toggleButton) {
        toggleButton.setAttribute("aria-expanded", String(isOpen));
      }

      if (tocPanel) {
        tocPanel.setAttribute("aria-hidden", String(!isOpen));
      }
    }

    // Update the sticky state of the mobile TOC based on scroll position
    function updateStickyState() {
      if (!mobileBreakpoint.matches) {
        mobileToc.classList.remove("is-stuck");
        return;
      }
      const referenceElement = landingTitle || landingSection;
      if (!referenceElement) {
        return;
      }
      const referenceBottom =
        referenceElement.getBoundingClientRect().bottom + window.scrollY;
      const stickyThreshold = Math.max(referenceBottom - 12, 0);
      const shouldStick = window.scrollY > stickyThreshold;

      mobileToc.classList.toggle("is-stuck", shouldStick);
    }

    // Sync the TOC mode (mobile vs desktop) and reset state when switching
    function syncTocMode() {
      if (!mobileBreakpoint.matches) {
        setOpenState(false);
        mobileToc.classList.remove("is-stuck");
        return;
      }
      updateStickyState();
    }

    setOpenState(false);
    syncTocMode();

    // Toggle mobile TOC open/closed when clicking the button
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        if (!mobileBreakpoint.matches) {
          return;
        }
        setOpenState(!isOpen);
      });
    }

    // Close mobile TOC when clicking outside of it
    document.addEventListener("click", (event) => {
      if (!mobileBreakpoint.matches || !isOpen) {
        return;
      }
      if (!mobileToc.contains(event.target)) {
        setOpenState(false);
      }
    });

    // Close mobile TOC on Escape key press
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        setOpenState(false);
      }
    });

    // Smooth scroll to section and close TOC when clicking a link
    tocLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const target = targetId ? document.querySelector(targetId) : null;

        if (!target) {
          return;
        }
        if (mobileBreakpoint.matches) {
          event.preventDefault();
          setOpenState(false);
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          if (targetId) {
            window.history.pushState(null, "", targetId);
          }
        }
      });
    });

    mobileBreakpoint.addEventListener("change", syncTocMode);
    window.addEventListener("scroll", updateStickyState, { passive: true });
    window.addEventListener("resize", syncTocMode);
  }
});

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

// smooth scrolling + theme toggle
document.addEventListener("click", function (e) {
  const scrollToTopLink = e.target.closest(".scroll-to-top");
  if (scrollToTopLink) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    return;
  }
  const themeToggle = e.target.closest(".theme-toggle");
  if (themeToggle) {
    e.preventDefault();
    toggleTheme();
  }
});

// CONTACT FORM CONNECT
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const shell = document.getElementById("contact-form-shell");
  const statusEl = form.querySelector(".form-status");
  const submitBtn = form.querySelector('button[type="submit"]');

  function showThanks() {
    // Lock height to prevent layout jump
    const h = shell
      ? shell.getBoundingClientRect().height
      : form.getBoundingClientRect().height;

    if (shell) {
      shell.style.height = `${h}px`;
      shell.style.maxWidth = "650px";
    }

    const target = shell || form;

    target.innerHTML = `
      <div class="contact-thanks">
        <h2>Thank you for your message!</h2>
        <p>✧ I'll be in contact soon ✧</p>
      </div>
    `;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot check (bots)
    const honeypot = form.querySelector('input[name="honeypot"]');
    if (honeypot && honeypot.value.trim() !== "") {
      showThanks();
      return;
    }

    if (statusEl) statusEl.textContent = "Sending…";
    if (submitBtn) submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, { method: "POST", body: formData });

      if (!res.ok) throw new Error("Request failed");
      showThanks();
    } catch (err) {
      if (statusEl)
        statusEl.textContent = "Oops — something went wrong. Please try again.";
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});

// FAQ accordion
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = Array.from(
    document.querySelectorAll(".faq-section .faq-item"),
  );
  if (!faqItems.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const duration = 320;
  const easing = "cubic-bezier(0.4, 0, 0.2, 1)";

  function getContent(item) {
    return item.querySelector(".faq-content");
  }

  function prepareItem(item) {
    const content = getContent(item);
    if (!content) return;

    content.style.overflow = "hidden";
    content.style.willChange = "height";

    if (prefersReducedMotion) {
      content.style.transition = "none";
      content.style.height = item.open ? "auto" : "0px";
      return;
    }

    content.style.transition = `height ${duration}ms ${easing}`;
    content.style.height = item.open ? "auto" : "0px";
  }

  function animateClose(item) {
    const content = getContent(item);
    if (!content || !item.open) return;

    if (prefersReducedMotion) {
      item.open = false;
      content.style.height = "0px";
      return;
    }

    content.style.height = `${content.scrollHeight}px`;
    // Force reflow so the browser acknowledges the start height before animating.
    void content.offsetHeight;

    item.dataset.animating = "true";
    content.style.height = "0px";

    const onEnd = (event) => {
      if (event.propertyName !== "height") return;
      content.removeEventListener("transitionend", onEnd);
      item.open = false;
      item.dataset.animating = "false";
    };

    content.addEventListener("transitionend", onEnd);
  }

  function animateOpen(item) {
    const content = getContent(item);
    if (!content || item.open) return;

    if (prefersReducedMotion) {
      item.open = true;
      content.style.height = "auto";
      return;
    }

    item.open = true;
    item.dataset.animating = "true";
    content.style.height = "0px";

    const targetHeight = content.scrollHeight;
    requestAnimationFrame(() => {
      content.style.height = `${targetHeight}px`;
    });

    const onEnd = (event) => {
      if (event.propertyName !== "height") return;
      content.removeEventListener("transitionend", onEnd);
      content.style.height = "auto";
      item.dataset.animating = "false";
    };

    content.addEventListener("transitionend", onEnd);
  }

  faqItems.forEach((item) => {
    prepareItem(item);

    const summary = item.querySelector("summary");
    if (!summary) return;

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (item.dataset.animating === "true") {
        return;
      }

      if (item.open) {
        animateClose(item);
        return;
      }

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          animateClose(otherItem);
        }
      });

      animateOpen(item);
    });
  });
});
