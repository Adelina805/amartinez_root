// js/components/footer.js
class SiteFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();

    this.innerHTML = `
      <footer class="site-footer">
        <div class="bar-inner">
        <div class="nav-links-left">
          <a href="index.html">Timeline</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="nav-links-right">
          <a href="https://github.com/Adelina805/amartinez_root" target="_blank">
            ©Adelina ${year}
          </a>
          <a href="#" class="scroll-to-top">scroll to top</a>
          <svg class="theme-toggle" width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Light / Dark Mode Toggle Icon">
            <path d="M11.8882 0L15.5618 7.44364L23.7764 8.63729L17.8323 14.4314L19.2355 22.6127L11.8882 18.75L4.54087 22.6127L5.94408 14.4314L-2.29246e-05 8.63729L8.21453 7.44364L11.8882 0Z" fill="currentColor"/>
          </svg>
        </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-footer", SiteFooter);
