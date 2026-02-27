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
