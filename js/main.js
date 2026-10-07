/* =====================================================================
   BRANTESH JALA SOLUTION - JAVASCRIPT
   Five small features, each in its own block:
   1. Mobile menu
   2. Drag-to-compare pipe slider
   3. Tabs ("Pick where you use water")
   4. Enquiry form -> opens WhatsApp with the message ready
   5. Footer year
   ===================================================================== */

/* The WhatsApp number in international format: 91 = India, then the 10 digits.
   Change it here if the number ever changes (also update the links in index.html). */
const WHATSAPP_NUMBER = "918970011661";


/* ---------- 1. MOBILE MENU ---------- */
(function mobileMenu() {
  const button = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  button.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  // Close the menu after tapping any link
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") setOpen(false); });
  // Close with the Escape key
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
})();


/* ---------- 2. DRAG-TO-COMPARE SLIDER ----------
   A hidden <input type="range"> gives us dragging, touch and keyboard
   support for free. When its value changes (0-100) we pass it to CSS
   as the variable --pos, and the CSS clips the top picture to that width. */
(function compareSlider() {
  const box = document.getElementById("compare");
  const range = document.getElementById("compareRange");
  if (!box || !range) return;

  const update = () => box.style.setProperty("--pos", range.value + "%");
  range.addEventListener("input", update);
  update();
})();


/* ---------- 3. TABS ----------
   Clicking a tab button shows the matching panel and hides the others.
   Arrow keys move between tabs, as screen-reader users expect. */
(function tabs() {
  const tabButtons = Array.from(document.querySelectorAll(".tab"));
  const panels = Array.from(document.querySelectorAll(".panel"));

  function activate(tab) {
    tabButtons.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => {
      const on = p.id === tab.getAttribute("aria-controls");
      p.classList.toggle("is-active", on);
      p.hidden = !on;
    });
  }

  tabButtons.forEach((tab, i) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (e) => {
      let next = null;
      if (e.key === "ArrowRight") next = tabButtons[(i + 1) % tabButtons.length];
      if (e.key === "ArrowLeft")  next = tabButtons[(i - 1 + tabButtons.length) % tabButtons.length];
      if (next) { e.preventDefault(); next.focus(); activate(next); }
    });
  });
})();


/* ---------- 4. ENQUIRY FORM -> WHATSAPP ----------
   There is no server. We check the fields, write a friendly message,
   and open WhatsApp with that message already typed. The customer just
   presses send. This works on Netlify with no extra setup. */
(function enquiryForm() {
  const form = document.getElementById("enquiryForm");
  const errorBox = document.getElementById("formError");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").trim();
    const place = (data.get("place") || "").trim();
    const usage = (data.get("usage") || "").trim();
    const note = (data.get("message") || "").trim();

    // Highlight any required field that is empty
    const missing = { name: !name, place: !place, usage: !usage };
    Object.keys(missing).forEach((field) => {
      form.elements[field].classList.toggle("invalid", missing[field]);
    });
    const hasError = Object.values(missing).some(Boolean);
    errorBox.hidden = !hasError;
    if (hasError) return;

    // Build the message
    let text = `Hello Brantesh Jala Solution,\n` +
               `My name is ${name} from ${place}.\n` +
               `I need a hard water solution for: ${usage}.`;
    if (note) text += `\nDetails: ${note}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  });
})();


/* ---------- 5. FOOTER YEAR ---------- */
(function footerYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
})();
