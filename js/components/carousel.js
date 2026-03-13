window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".gallery.swiper").forEach((el) => {
    new Swiper(el, {
      rewind: true,
      loop: false,
      speed: 700,
      slidesPerView: 1,
      grabCursor: true,

      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },

      navigation: {
        nextEl: el.querySelector(".swiper-button-next"),
        prevEl: el.querySelector(".swiper-button-prev")
      }
    });
  });
});