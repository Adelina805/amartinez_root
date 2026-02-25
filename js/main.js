// smooth scrolling
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("back-to-top")) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
});