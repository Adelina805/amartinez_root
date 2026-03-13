// js/components/timeline-section.js
class TimelineSection extends HTMLElement {
  connectedCallback() {
    const id = this.getAttribute("section-id") || "";
    const title = this.getAttribute("title") || "";
    const dates = this.getAttribute("dates") || "";
    const theme = this.getAttribute("theme") || "light";
    const content = this.innerHTML;

    this.innerHTML = `
      <section id="${id}" class="timeline-section timeline-section--${theme}">
        <svg class="hero-star hero-star--1 timeline-star" viewBox="0 0 165 172" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M164.377 87.3351L110.027 112.381L99.847 171.353L59.2313 127.402L9.32766e-07 135.944L29.2488 83.7348L2.8216 30.0421L61.5141 41.7258L104.412 -3.59839e-07L111.438 59.4303L164.377 87.3351Z" fill="currentColor" />
        </svg>
        <div class="container">
          <div class="section-title">
            <h2 class="section-label">${title}</h2>
            <h3 class="section-date">${dates}</h3>
            <div class="divider"></div>
          </div>
          <div class="section-content">
            ${content}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define("timeline-section", TimelineSection);
