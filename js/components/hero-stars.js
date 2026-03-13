class HeroStars extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="hero-stars-container">
        <svg class="hero-star hero-star--1" viewBox="0 0 165 172" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M164.377 87.3351L110.027 112.381L99.847 171.353L59.2313 127.402L9.32766e-07 135.944L29.2488 83.7348L2.8216 30.0421L61.5141 41.7258L104.412 -3.59839e-07L111.438 59.4303L164.377 87.3351Z" fill="currentColor" />
        </svg>
        <svg class="hero-star hero-star--2" viewBox="0 0 165 172" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M164.377 87.3351L110.027 112.381L99.847 171.353L59.2313 127.402L9.32766e-07 135.944L29.2488 83.7348L2.8216 30.0421L61.5141 41.7258L104.412 -3.59839e-07L111.438 59.4303L164.377 87.3351Z" fill="currentColor" />
        </svg>
        <svg class="hero-star hero-star--3" viewBox="0 0 165 172" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M164.377 87.3351L110.027 112.381L99.847 171.353L59.2313 127.402L9.32766e-07 135.944L29.2488 83.7348L2.8216 30.0421L61.5141 41.7258L104.412 -3.59839e-07L111.438 59.4303L164.377 87.3351Z" fill="currentColor" />
        </svg>
        <svg class="hero-star hero-star--4" viewBox="0 0 165 172" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M164.377 87.3351L110.027 112.381L99.847 171.353L59.2313 127.402L9.32766e-07 135.944L29.2488 83.7348L2.8216 30.0421L61.5141 41.7258L104.412 -3.59839e-07L111.438 59.4303L164.377 87.3351Z" fill="currentColor" />
        </svg>
        <svg class="hero-star hero-star--5" viewBox="0 0 165 172" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M164.377 87.3351L110.027 112.381L99.847 171.353L59.2313 127.402L9.32766e-07 135.944L29.2488 83.7348L2.8216 30.0421L61.5141 41.7258L104.412 -3.59839e-07L111.438 59.4303L164.377 87.3351Z" fill="currentColor" />
        </svg>
      </div>
    `;
  }
}

customElements.define("hero-stars", HeroStars);
