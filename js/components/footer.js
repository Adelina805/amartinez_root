// js/components/footer.js
class SiteFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();

    this.innerHTML = `
      <footer class="footer">
        <div class="nav-links-left">
          <a href="index.html">Timeline</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="nav-links-right">
          <a href="https://github.com/Adelina805/amartinez_root" target="_blank">
            ©Adelina ${year}
          </a>
          <a href="#" class="back-to-top">Back to top</a>
          <img src="stars/Star-Icon.svg"
               alt="Light / Dark Mode Toggle Icon"
               id="theme-toggle" />
        </div>
      </footer>
    `;
  }
}

customElements.define("site-footer", SiteFooter);