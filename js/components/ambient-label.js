/**
 * Ambient Label - A lightweight, cursor-following contextual tooltip system.
 * Single reusable floating label that appears on hover/focus with smart edge detection.
 * Coexists cleanly with sparkle cursor (pointer-events: none).
 * No frameworks, minimal DOM footprint, event delegation-based.
 */

class AmbientLabel {
  constructor() {
    this.element = null;
    this.isVisible = false;
    this.currentTarget = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.enabled = true;

    // Detect if device supports hover (disables on touch-only devices)
    this.touchOnly = !window.matchMedia("(hover: hover)").matches;

    // Phrase bank: sarcastic/playful
    this.phrases = {
      button: [
        "click me",
        "do something",
        "make a choice",
        "<button>",
        "interact",
      ],
      link: [
        "go somewhere",
        "click the link",
        "this is <a> link",
        "take me there",
      ],
      image: [
        "this is a picture",
        "<img> content",
        "an image",
        "look at this",
        "wow a photo",
      ],
      header: [
        "h1 text",
        "a heading",
        "important words",
        "the title",
        "read this",
      ],
      footer: [
        "ooh a footer!",
        "fine print",
        "the bottom",
        "<footer>",
        "the end",
      ],
      input: [
        "your name here",
        "type something",
        "fill this in",
        "talk to me",
        "your input",
      ],
      textarea: [
        "say something nice",
        "write more",
        "your thoughts",
        "go on...",
        "just say hello",
      ],
      toggle: [
        "intuitive button",
        "flip the switch",
        "toggle me",
        "change themes",
        "dark or light?",
      ],
      star: [
        "click me",
        "wow I spin",
        "ooh shiny",
        "I'm a star ✧",
        "this is a star",
      ],
      timeline: [
        "the semesters",
        "timeline",
        "a chapter",
        "history",
        "my journey",
      ],
      faqs: [
        "frequently asked",
        "common question",
        "click for answer",
        "in case you were wondering",
        "the FAQs",
      ],
      "website-header": [
        "site header",
        "top of page",
        "navigation",
        "<welcome>",
        "the top",
      ],
      "section-quote": [
        "wise words",
        "a quote",
        "inspiration",
        "profound",
        "something to ponder",
      ],
      courselist: [
        "what I did",
        "what I was up to",
        "some classes I took",
        "course highlights",
        "courses I enjoyed",
      ],
      paragraph: [
        "some text",
        "read this",
        "words",
        "a paragraph",
        "interesting...",
      ],
    };

    this.explicitSelector = "[data-ambient-tip], [data-ambient-tip-group]";
    this.fallbackRules = [
      {
        selector:
          'button:not([data-no-ambient-tip]), [role="button"]:not([data-no-ambient-tip]), input[type="button"]:not([data-no-ambient-tip]), input[type="submit"]:not([data-no-ambient-tip]), input[type="reset"]:not([data-no-ambient-tip])',
        group: "button",
      },
      {
        selector:
          'a[href]:not([data-no-ambient-tip]), [role="link"]:not([data-no-ambient-tip])',
        group: "link",
      },
      {
        selector:
          'input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([data-no-ambient-tip]), select:not([data-no-ambient-tip])',
        group: "input",
      },
      {
        selector: "textarea:not([data-no-ambient-tip])",
        group: "textarea",
      },
      {
        selector:
          'svg.theme-toggle:not([data-no-ambient-tip]), .theme-toggle:not([data-no-ambient-tip]), [aria-label*="mode" i]:not([data-no-ambient-tip])',
        group: "toggle",
      },
      {
        selector:
          '#spinning-star:not([data-no-ambient-tip]), [data-ambient-tip-group="star"]',
        group: "star",
      },
      {
        // Only target the specific date marker inside timeline sections.
        selector: ".section-date:not([data-no-ambient-tip])",
        group: "timeline",
      },
      {
        selector:
          '.faq:not([data-no-ambient-tip]), .faq-item:not([data-no-ambient-tip]), [class*="faq"]:not([data-no-ambient-tip])',
        group: "faqs",
      },
      {
        selector:
          'site-header:not([data-no-ambient-tip]), .site-header:not([data-no-ambient-tip]), [role="banner"]:not([data-no-ambient-tip])',
        group: "website-header",
      },
      {
        selector:
          '.section-quote:not([data-no-ambient-tip]), blockquote:not([data-no-ambient-tip]), [class*="quote"]:not([data-no-ambient-tip])',
        group: "section-quote",
      },
      {
        selector:
          ".section-courselist-dark:not([data-no-ambient-tip]), .section-courselist-light:not([data-no-ambient-tip])",
        group: "courselist",
      },
      {
        selector:
          "img:not([data-no-ambient-tip]), picture img:not([data-no-ambient-tip])",
        group: "image",
      },
      {
        selector: "p:not([data-no-ambient-tip])",
        group: "paragraph",
      },
      {
        selector:
          "h1:not([data-no-ambient-tip]), h2:not([data-no-ambient-tip]), h3:not([data-no-ambient-tip]), h4:not([data-no-ambient-tip]), h5:not([data-no-ambient-tip]), h6:not([data-no-ambient-tip])",
        group: "header",
      },
      {
        selector:
          "footer:not([data-no-ambient-tip]), .site-footer:not([data-no-ambient-tip])",
        group: "footer",
      },
    ];

    this.padding = 8; // buffer from viewport edges
  }

  /**
   * Initialize the ambient label system.
   * Call once on DOMContentLoaded after theme is applied.
   */
  static init() {
    if (window.AmbientLabelInstance) {
      return; // Already initialized
    }
    const instance = new AmbientLabel();
    instance.setup();
    window.AmbientLabelInstance = instance;
  }

  setup() {
    if (this.touchOnly) {
      // Gracefully disable on touch-only devices
      return;
    }

    // Create the floating label element
    this.element = document.createElement("div");
    this.element.className = "ambient-label";
    this.element.setAttribute("role", "tooltip");
    this.element.setAttribute("aria-hidden", "true");
    document.body.appendChild(this.element);

    // Respect reduced motion preference
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Global event delegation
    document.addEventListener("mousemove", (e) => this.handleMouseMove(e), {
      passive: true,
    });
    document.addEventListener("mouseover", (e) => this.handleEnter(e), true);
    document.addEventListener("mouseout", (e) => this.handleLeave(e), true);
    document.addEventListener("focusin", (e) => this.handleFocus(e), true);
    document.addEventListener("focusout", (e) => this.handleBlur(e), true);
  }

  handleMouseMove(e) {
    if (!this.enabled || this.touchOnly || !this.isVisible) return;

    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    this.updatePosition();
  }

  handleEnter(e) {
    if (!this.enabled || this.touchOnly) return;

    const target = this.resolveTarget(e.target);
    if (!target) return;

    const label = this.getAmbientLabel(target);
    if (label) {
      this.currentTarget = target;
      this.setText(label);
      this.show();
    }
  }

  handleLeave(e) {
    if (!this.enabled || this.touchOnly) return;

    if (!this.currentTarget) return;

    const relatedTarget = this.resolveTarget(e.relatedTarget);
    if (relatedTarget && this.currentTarget.contains(relatedTarget)) {
      return;
    }

    const target = this.resolveTarget(e.target);
    if (
      target &&
      (target === this.currentTarget || this.currentTarget.contains(target))
    ) {
      this.hide();
      this.currentTarget = null;
    }
  }

  handleFocus(e) {
    if (!this.enabled || this.touchOnly) return;

    const target = this.resolveTarget(e.target);
    if (!target) return;

    const label = this.getAmbientLabel(target);
    if (label) {
      this.currentTarget = target;
      this.setText(label);
      this.show();
    }
  }

  handleBlur(e) {
    if (!this.enabled || this.touchOnly) return;

    if (!this.currentTarget) return;

    const relatedTarget = this.resolveTarget(e.relatedTarget);
    if (relatedTarget && this.currentTarget.contains(relatedTarget)) {
      return;
    }

    const target = this.resolveTarget(e.target);
    if (
      target &&
      (target === this.currentTarget || this.currentTarget.contains(target))
    ) {
      this.hide();
      this.currentTarget = null;
    }
  }

  /**
   * Find the closest element that should receive an ambient label.
   * Explicit data attributes win, then contextual fallback rules.
   */
  resolveTarget(target) {
    // Prefer the nearest ancestor match (including the element itself).
    // Walk up from the target to document so inner elements (e.g., section text,
    // section-quote, section title) take precedence over outer containers like
    // timeline sections which may contain them.
    if (!(target instanceof Element)) return null;

    // If any ancestor explicitly opts out, bail early.
    if (target.closest("[data-no-ambient-tip]")) return null;

    let node = target;
    while (node && node instanceof Element) {
      // Explicit attributes win immediately on the closest node.
      if (node.matches(this.explicitSelector)) return node;

      // Check fallback rules against this exact node (not global closest).
      for (const rule of this.fallbackRules) {
        try {
          if (node.matches(rule.selector)) return node;
        } catch (err) {
          // Ignore malformed selectors (defensive)
        }
      }

      node = node.parentElement;
    }

    return null;
  }

  /**
   * Get the label text for an element.
   * Priority: data-ambient-tip > data-ambient-tip-group > null
   */
  getAmbientLabel(el) {
    // Defensive check: ensure el is an Element node
    if (!el || typeof el.getAttribute !== "function") {
      return null;
    }

    // Check for explicit static text
    const staticLabel = el.getAttribute("data-ambient-tip");
    if (staticLabel) return staticLabel;

    // Check for phrase bank group
    const groupName = el.getAttribute("data-ambient-tip-group");
    if (groupName && this.phrases[groupName]) {
      const phrases = this.phrases[groupName];
      return phrases[Math.floor(Math.random() * phrases.length)];
    }

    for (const rule of this.fallbackRules) {
      if (el.matches(rule.selector)) {
        const phrases = this.phrases[rule.group];
        if (phrases && phrases.length) {
          return phrases[Math.floor(Math.random() * phrases.length)];
        }
      }
    }

    return null;
  }

  setText(text) {
    if (!this.element) return;
    this.element.textContent = text;
  }

  show() {
    if (!this.element || this.isVisible) return;

    this.isVisible = true;
    this.element.classList.add("is-visible");
    this.updatePosition();
  }

  hide() {
    if (!this.element || !this.isVisible) return;

    this.isVisible = false;
    this.element.classList.remove("is-visible");
  }

  /**
   * Position label centered on the cursor with viewport clamping.
   */
  updatePosition() {
    if (!this.element || !this.isVisible) return;

    const rect = this.element.getBoundingClientRect();
    const labelWidth = rect.width || 100; // Fallback if not yet measured
    const labelHeight = rect.height || 30;

    let x = this.mouseX - labelWidth / 2;
    let y = this.mouseY - labelHeight / 2 - 12;

    // Clamp to viewport (safety net)
    x = Math.max(
      this.padding,
      Math.min(x, window.innerWidth - labelWidth - this.padding),
    );
    y = Math.max(
      this.padding,
      Math.min(y, window.innerHeight - labelHeight - this.padding),
    );

    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
  }

  /**
   * Add a custom phrase group (or override existing one).
   */
  addPhraseGroup(groupName, phrases) {
    this.phrases[groupName] = phrases;
  }

  /**
   * Temporarily disable ambient labels (useful for modals, etc.).
   */
  disable() {
    this.enabled = false;
    this.hide();
  }

  /**
   * Re-enable ambient labels.
   */
  enable() {
    this.enabled = true;
  }
}

// Auto-init on DOMContentLoaded if not already done
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    AmbientLabel.init();
  });
} else {
  AmbientLabel.init();
}
