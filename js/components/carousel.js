window.addEventListener("DOMContentLoaded", () => {
  const swipers = [];

  document.querySelectorAll(".gallery.swiper").forEach((el) => {
    const s = new Swiper(el, {
      loop: true,
      speed: 700,
      slidesPerView: 1,
      grabCursor: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,

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

    swipers.push(s);
  });

  let rAF;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      swipers.forEach((s) => s.update());
    });
  });
});