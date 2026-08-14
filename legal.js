// ============================================================
// KARINE S. MATTHEWS — LEGAL PAGE RENDERER
// ------------------------------------------------------------
// Builds privacy.html, terms.html and disclaimer.html from
// content.js → `legal`. Each page is a thin stub that says which
// document it is (`<main data-doc="privacy">`); everything else,
// including the header and the footer, is rendered here so the
// three pages can never drift apart.
//
// ⚠️ This deliberately does NOT load script.js. That file drives the
// hero canvas, Lenis, GSAP, the booking builder and the voucher
// preview, and it reaches straight into elements that only exist on
// index.html, so importing it here would throw. No Lenis on these
// pages also means no second rAF, which keeps the mobile-smoothness
// gate honest by construction.
//
// ⚠️ `has-js` is never added to <html> here on purpose: styles.css
// hides [data-reveal] and .foil-line behind it and waits for an
// IntersectionObserver that does not exist on these pages. Plain
// headings only.
// ============================================================

import { content } from './content.js';

const $ = (sel, root = document) => root.querySelector(sel);

// The copy is authored in content.js, not user input, but escaping keeps a
// stray ampersand or angle bracket from silently breaking a legal page.
const esc = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

// `{phone}` lives in exactly one place — brand.phone — so the number can never
// go stale in one document and not the others.
const fill = (s) => esc(s).replace(/\{phone\}/g, esc(content.brand.phone));

// The SMS deep link, matching the pattern every CTA on the main site uses.
function bookingSms(intro) {
  const base = content.booking.smsHref || `sms:${content.brand.phoneHref.replace('tel:', '')}`;
  const sep = /iPhone|iPad|Macintosh/.test(navigator.userAgent) ? '&' : '?';
  return `${base}${sep}body=${encodeURIComponent(intro)}`;
}

// ---- HEADER ----
// Slim by design: this is a document, not a landing page. One way home and one
// way to book, both at least 44px tall.
function renderHeader() {
  const nav = $('#legalNav');
  if (!nav) return;
  nav.innerHTML = `
    <div class="container legal-nav-inner">
      <a href="index.html" class="legal-brand">${esc(content.brand.wordmark)}</a>
      <a href="index.html#book" class="btn btn-primary legal-nav-cta">Book a session <span class="arrow">→</span></a>
    </div>`;
}

// ---- THE DOCUMENT ----
function renderDoc() {
  const host = $('#legalDoc');
  if (!host) return;
  const key = host.dataset.doc;
  const L = content.legal;
  const doc = L && L.docs && L.docs[key];
  if (!doc) return;                                  // honest empty state: render nothing rather than a shell

  document.title = `${doc.title} — ${content.brand.name}`;
  const desc = $('meta[name="description"]');
  if (desc && doc.metaDescription) desc.setAttribute('content', doc.metaDescription);

  // Business line. The ABN appears the moment brand.abn is filled in and stays
  // out of the way entirely while it is empty — no empty label, no "ABN: TBC".
  const abn = (content.brand.abn || '').trim();
  const business = [
    esc(content.brand.name),
    abn ? `ABN ${esc(abn)}` : '',
    esc(content.brand.region)
  ].filter(Boolean).join(' · ');

  const sections = doc.sections.map((s) => {
    const id = s.id ? ` id="${esc(s.id)}"` : '';
    const before = (s.p || []).map(t => `<p>${fill(t)}</p>`).join('');
    const list = (s.list && s.list.length)
      ? `<ul class="legal-list">${s.list.map(t => `<li>${fill(t)}</li>`).join('')}</ul>`
      : '';
    const after = (s.after || []).map(t => `<p>${fill(t)}</p>`).join('');
    return `<section class="legal-section"${id}><h2>${esc(s.h)}</h2>${before}${list}${after}</section>`;
  }).join('');

  // Cross-links to the other two documents, so no page is a dead end.
  const others = (L.order || Object.keys(L.docs))
    .filter(k => k !== key && L.docs[k])
    .map(k => `<a href="${esc(L.docs[k].slug)}">${esc(L.docs[k].title)}</a>`)
    .join('');

  host.innerHTML = `
    <p class="legal-back"><a href="index.html">← ${esc(L.backLabel)}</a></p>
    <header class="legal-head">
      <h1>${esc(doc.title)}</h1>
      ${doc.intro ? `<p class="legal-intro">${fill(doc.intro)}</p>` : ''}
      <p class="legal-meta">
        <span>${esc(L.updatedLabel)} ${esc(L.updated)}</span>
        <span class="legal-meta-business">${business}</span>
      </p>
    </header>
    ${sections}
    <aside class="legal-aside">
      <p class="legal-aside-lead">Any questions about any of this, please just ask.</p>
      <p><a class="btn btn-ghost" href="${bookingSms("I have a question about your terms.")}">Text Karine on ${esc(content.brand.phone)}</a></p>
      ${others ? `<p class="legal-crosslinks">Also worth reading: ${others}</p>` : ''}
    </aside>`;
}

// ---- FOOTER ----
// Same markup and the same classes as index.html, rendered from one place so
// the two can never disagree. Explore links are absolute-to-index so they work
// from a legal page.
function renderFooter() {
  const foot = $('#legalFooter');
  if (!foot) return;
  const L = content.legal;
  const legalLinks = (L && L.docs)
    ? (L.order || Object.keys(L.docs))
        .filter(k => L.docs[k])
        .map(k => `<a href="${esc(L.docs[k].slug)}">${esc(L.docs[k].navLabel)}</a>`)
        .join('')
    : '';

  foot.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-tag">KARINE S. MATTHEWS</div>
          <p class="footer-blurb">Intuitive psychic mediumship readings and Reiki healing. In person in Gilston, or online worldwide.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <ul>
            <li><a href="index.html#services">Sessions</a></li>
            <li><a href="index.html#journey">How it works</a></li>
            <li><a href="index.html#vouchers">Gift vouchers</a></li>
            <li><a href="index.html#about">About</a></li>
            <li><a href="index.html#faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3>Connect</h3>
          <ul>
            <li><a href="${bookingSms("I'd like to book a session.")}">Text Karine</a></li>
            <li><a href="${esc(content.booking.phoneHref)}">${esc(content.booking.phone)}</a></li>
          </ul>
        </div>
        <div>
          <h3>Follow</h3>
          <ul>${content.socials.map(so =>
            `<li><a href="${esc(so.url)}" target="_blank" rel="noopener">${esc(so.label)}</a></li>`
          ).join('')}</ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${esc(content.brand.name)}${content.brand.abn ? ` · ABN ${esc(content.brand.abn)}` : ''}</span>
        <span>${esc(content.brand.region)}</span>
        <nav class="footer-legal" aria-label="Legal">${legalLinks}</nav>
      </div>
    </div>`;
}

renderHeader();
renderDoc();
renderFooter();
