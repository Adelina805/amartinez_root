const THEME_STORAGE_KEY = "site-theme";
const FAQ_STAR_LIGHT = "stars/Star-Deco-Light.svg";
const FAQ_STAR_DARK = "stars/Star-Deco-Dark.svg";
const FAQ_CHEVRON_LIGHT = "stars/chevron-Light.svg";
const FAQ_CHEVRON_DARK = "stars/chevron-Dark.svg";

function updateFaqIcons(theme) {
  const starSrc = theme === "dark" ? FAQ_STAR_DARK : FAQ_STAR_LIGHT;
  const chevronSrc = theme === "dark" ? FAQ_CHEVRON_DARK : FAQ_CHEVRON_LIGHT;

  document.querySelectorAll(".faq-star").forEach((star) => {
    star.setAttribute("src", starSrc);
  });

  document.querySelectorAll(".faq-chevron").forEach((chevron) => {
    chevron.setAttribute("src", chevronSrc);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  updateFaqIcons(theme);
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

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(getInitialTheme());
});

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
