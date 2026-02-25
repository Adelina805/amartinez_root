// js/components/header.js
class SiteHeader extends HTMLElement {
  connectedCallback() {
    const current = (this.getAttribute("current") || "").toLowerCase();
    this.innerHTML = `
      <header class="site-header">
        <div class="nav-links-left">
          <a href="index.html" class="${current === 'home' ? 'active' : ''}">Timeline</a>
          <a href="about.html" class="${current === 'about' ? 'active' : ''}">About</a>
          <a href="contact.html" class="${current === 'contact' ? 'active' : ''}">Contact</a>
        </div>
        <div class="nav-links-right">
          <img src="stars/Star-Icon.svg" alt="Light / Dark Mode Toggle Icon" id="theme-toggle" />
        </div>
      </header>
    `;
  }
}
customElements.define('site-header', SiteHeader);