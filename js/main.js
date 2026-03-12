const THEME_STORAGE_KEY = "site-theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

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

// CONTACT FORM CONNECTdocument.addEventListener("DOMContentLoaded", () => {
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
      shell.style.maxWidth = "650px"; // matches your form max-width
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
