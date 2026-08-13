// ============================================================
// KARINE S. MATTHEWS — APP SCRIPT
// Renders from content.js, wires Lenis + GSAP, golden-hour motion layer.
// Booking is SMS-first: every Book / Text / Order button resolves to
// a pre-filled sms: message (no server, no fake-success forms).
// ============================================================
import { content } from './content.js';

const REDUCED  = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NO_HOVER = matchMedia('(hover: none)').matches;
// FX = the desktop-only signature layer (tilt, cursor trail, sun dial, parallax,
// continuous shimmer/aurora). Hard-gated so the phone stays pristine.
const FX = !REDUCED && !NO_HOVER && window.innerWidth >= 1025;
document.documentElement.classList.add('has-js');
if (FX) document.documentElement.classList.add('fx');

function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

// Currency — plain AUD, no decimals (prices are whole dollars).
function currencyAU(n) { return '$' + Number(n).toLocaleString('en-AU'); }
// Karine asked for prices to read "$90 AUD". priceSuffix lives in content.js.
function priceAUD(n) { const sfx = content.booking && content.booking.priceSuffix; return currencyAU(n) + (sfx ? ' ' + sfx : ''); }

// Build a pre-filled SMS booking/enquiry link from a short intro line.
function bookingSms(intro) {
  const body = encodeURIComponent(`Hi Karine! ${intro} My name: `);
  return `${content.booking.smsHref}?&body=${body}`;
}

// ============================================================
// SPLIT-TEXT — wraps words (and inline <em> accents) for the reveal.
// DOM-based so inline <em> foil accents survive the split intact.
// The inner-span translateY only clips visually; text stays live for
// screen readers (no aria-hidden / sr-only duplication needed).
// ============================================================
function splitElement(el) {
  const out = [];
  let wi = 0;   // word index → drives the per-word reveal cascade (--i)
  Array.from(el.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach(tok => {
        if (tok === '') return;
        if (/^\s+$/.test(tok)) { out.push(document.createTextNode(tok)); return; }
        const word = document.createElement('span'); word.className = 'split-word';
        word.style.setProperty('--i', wi++);
        const inner = document.createElement('span'); inner.textContent = tok;
        word.appendChild(inner); out.push(word);
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Reveal an inline element (e.g. <em>) as a single unit, kept intact.
      const word = document.createElement('span'); word.className = 'split-word';
      word.style.setProperty('--i', wi++);
      const inner = document.createElement('span'); inner.appendChild(node.cloneNode(true));
      word.appendChild(inner); out.push(word);
    }
  });
  el.innerHTML = '';
  out.forEach(n => el.appendChild(n));
}
function applySplits() {
  $$('.split').forEach(el => {
    if (el.dataset.split === 'done') return;
    splitElement(el);
    el.dataset.split = 'done';
  });
}

// Karine writes her copy in paragraphs. Split on blank lines so her
// intended breaks survive instead of collapsing into one block.
function paras(text, cls) {
  return String(text || '').split(/\n{2,}/).map(t => `<p class="${cls}">${t.trim()}</p>`).join('');
}

// ============================================================
// DISCLOSURE (accordion) — Nicholas, 2026-08-10: "make them a drop-down so
// that there's not as much writing at once."
//
// Rules this obeys:
//  • real <button> with aria-expanded + aria-controls, so it is keyboard
//    operable and announced correctly. No div-with-onclick.
//  • height is animated with a plain CSS transition, not JS per-frame work,
//    so it never adds a second raf and never fights Lenis.
//  • under reduced motion it returns the content RAW — no button, no panel,
//    everything visible and static (hard rule 6). That is why REDUCED is
//    checked here and not only in CSS.
//  • the price, duration and Book CTA are never inside a panel. They are the
//    conversion path and stay visible whether it is open or shut.
// ============================================================
let discloseSeq = 0;
function disclosure(label, innerHtml, cls) {
  if (!innerHtml) return '';
  if (REDUCED) return `<div class="${cls || ''} disclose-static">${innerHtml}</div>`;
  const id = `disclose-${++discloseSeq}`;
  return `
    <div class="disclose ${cls || ''}">
      <button type="button" class="disclose-toggle" aria-expanded="false" aria-controls="${id}">
        <span class="disclose-label">${label}</span>
        <span class="disclose-chev" aria-hidden="true"></span>
      </button>
      <div class="disclose-panel" id="${id}">
        <div class="disclose-inner">${innerHtml}</div>
      </div>
    </div>`;
}

function initDisclosures() {
  if (REDUCED) return;
  const panels = $$('.disclose-panel');
  if (!panels.length) return;

  // Once a panel finishes opening, drop the fixed height so it can reflow with
  // the text (font swap, resize). Then let ScrollTrigger re-measure the page.
  panels.forEach(panel => {
    panel.addEventListener('transitionend', e => {
      if (e.propertyName !== 'height') return;
      if (panel.classList.contains('is-open')) panel.style.height = 'auto';
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  document.addEventListener('click', e => {
    const btn = e.target.closest('.disclose-toggle');
    if (!btn) return;
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      panel.style.height = panel.scrollHeight + 'px';
      void panel.offsetHeight;                 // flush the layout, no rAF needed
      panel.classList.remove('is-open');
      panel.style.height = '0px';
      btn.setAttribute('aria-expanded', 'false');
    } else {
      panel.classList.add('is-open');
      panel.style.height = panel.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
}

// ============================================================
// HORIZONTAL RAIL — the pendulum shop (2026-08-10)
//
// Nicholas: "all those pendulums I want that to be a horizontal scroll so that
// if they want to buy the pendulum they can control horizontally and look at
// all of them, if they don't want to they can just keep scrolling down past
// them."
//
// This is deliberately NOT the pinned + scrubbed track that #journey uses.
// A pin converts vertical scroll into horizontal travel and traps the visitor
// until the track finishes — the exact opposite of what was asked for. Here the
// browser does the scrolling natively and the page scrolls past untouched.
//
// Rules this obeys:
//  • no requestAnimationFrame and no GSAP ticker of its own — the scroll
//    listener is passive and does nothing but toggle two classes (mobile gate).
//  • the buttons are aria-disabled at the ends, never `disabled`, so reaching
//    the end of the rail cannot orphan keyboard focus.
//  • the track is focusable and arrow-key scrollable; tabbing onto a card's
//    Order-by-text button scrolls it into view natively, so nothing is stranded.
//  • under reduced motion the scroll jumps instead of gliding (see also the CSS,
//    which drops scroll-snap so there is no animated snap-back).
// ============================================================
function initRails() {
  $$('.rail').forEach(rail => {
    const track = rail.querySelector('.rail-track');
    if (!track) return;
    const prev = rail.querySelector('[data-rail-prev]');
    const next = rail.querySelector('[data-rail-next]');

    // One card plus one gap, so a click always lands on a snap point.
    const step = () => {
      const first = track.firstElementChild;
      if (!first) return Math.round(track.clientWidth * 0.8);
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return Math.round(first.getBoundingClientRect().width + gap);
    };

    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 1;
      const atEnd = max <= 1 || track.scrollLeft >= max - 1;
      track.classList.toggle('at-start', atStart);
      track.classList.toggle('at-end', atEnd);
      if (prev) prev.setAttribute('aria-disabled', String(atStart));
      if (next) next.setAttribute('aria-disabled', String(atEnd));
    };

    const nudge = dir => track.scrollBy({ left: dir * step(), behavior: REDUCED ? 'auto' : 'smooth' });
    const wire = (btn, dir) => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        if (btn.getAttribute('aria-disabled') === 'true') return;
        nudge(dir);
      });
    };
    wire(prev, -1);
    wire(next, 1);

    // Left/right move the rail. Up/down are left alone on purpose so vertical
    // page scroll always passes straight through, focus or no focus.
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight')     { e.preventDefault(); nudge(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(-1); }
    });

    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    sync();
  });
}

// ============================================================
// INCLUSION VIDEOS — same contract as the hero video.
// The poster paints first, the <video> is only ever created when motion is
// allowed (reduced motion gets the still and no video element at all), and the
// autoplay flags are set as BOTH properties and attributes because iOS Safari
// reads the attributes. The loop is a ping-pong baked into the file, so all the
// player ever does is loop = true.
// ============================================================
function initInclusionVideos() {
  $$('[data-inclusion-video]').forEach(mount => {
    const src = mount.dataset.inclusionVideo;
    if (!src) return;
    const v = document.createElement('video');
    v.className = 'inclusion-video';
    v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('autoplay', '');
    v.setAttribute('loop', ''); v.setAttribute('preload', 'auto');
    if (mount.dataset.poster) v.poster = mount.dataset.poster;
    if (mount.dataset.label) { v.setAttribute('role', 'img'); v.setAttribute('aria-label', mount.dataset.label); }
    v.src = src;
    mount.appendChild(v);
    const p = v.play(); if (p && typeof p.catch === 'function') p.catch(() => {});
  });
}

// Small inline SVG glyph set (stroke icons).
const GLYPHS = {
  home:   `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15 16 6l11 9"/><path d="M8 13v12h16V13"/><path d="M13 25v-6h6v6"/></svg>`,
  globe:  `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="11"/><path d="M5 16h22M16 5c3 3.5 4.5 7 4.5 11S19 24 16 27c-3-3-4.5-7-4.5-11S13 8.5 16 5z"/></svg>`,
  moon:   `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 20a8 8 0 1 1-6-13 6.5 6.5 0 1 0 6 13z"/></svg>`,
  portal: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="16" cy="16" rx="6" ry="11"/><ellipse cx="16" cy="16" rx="11" ry="11"/></svg>`,
  cards:  `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="5" width="13" height="19" rx="2" transform="rotate(-8 13 14)"/><rect x="12" y="8" width="13" height="19" rx="2" transform="rotate(6 18 17)"/></svg>`,
  gift:   `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 13h20v4H6zM8 17v9h16v-9M16 13v13"/><path d="M16 13s-5 0-6-3 3-3 6 3c3-6 7-5 6 3 0 3-6 0-6 0z"/></svg>`,
  star:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 6.9L21 11l-6.6 2.1L12 20l-2.4-6.9L3 11l6.6-2.1z"/></svg>`
};

// ============================================================
// RENDERERS
// ============================================================
function renderHero() {
  const h = content.hero;
  $('#heroKicker').textContent = h.kicker;
  // Her four pillars, gold-dot separated exactly as they sit on her banner.
  $('#heroTagline').innerHTML = (h.tagline || [])
    .map(t => `<span>${t}</span>`).join('<i class="tagline-dot" aria-hidden="true">·</i>');

  const title = $('#heroTitle');
  title.innerHTML = h.headlineLines.map(line => `<span class="line">${line}</span>`).join('');
  title.querySelectorAll('.line').forEach(splitElement);
  title.dataset.split = 'done';

  $('#heroSub').textContent = h.sub;

  const secondaryHref = h.secondaryCta.intent === 'sms'
    ? bookingSms("I'd like to book a session.")
    : h.secondaryCta.href;
  $('#heroCtas').innerHTML = `
    <a href="${h.primaryCta.href}" class="btn btn-primary">${h.primaryCta.label} <span class="arrow">→</span></a>
    <a href="${secondaryHref}" class="btn btn-ghost">${h.secondaryCta.label}</a>
  `;

  const trust = $('#heroTrust');
  if (trust && Array.isArray(h.trust)) {
    trust.innerHTML = h.trust.map(t => `<li>${t}</li>`).join('');
  }

  // Cinematic hero background: poster paints immediately; the video layers in when
  // motion is allowed. Reduced-motion keeps the still poster only.
  const media = $('#heroMedia');
  if (h.poster) media.style.backgroundImage = `url(${h.poster})`;
  if (!REDUCED && h.video) {
    const v = document.createElement('video');
    v.className = 'hero-video';
    v.muted = true; v.defaultMuted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('autoplay', '');
    v.setAttribute('loop', ''); v.setAttribute('preload', 'auto');
    if (h.poster) v.poster = h.poster;
    v.src = h.video;
    media.appendChild(v);
    const p = v.play(); if (p && typeof p.catch === 'function') p.catch(() => {});
    $('#hero').classList.add('has-video');
  }
}

function renderIntro() {
  const i = content.intro;
  $('#welcomeEyebrow').innerHTML = `<span class="dot"></span> ${i.eyebrow}`;
  const q = $('#welcomeQuestions');
  if (q) { q.classList.add('stagger'); q.innerHTML = (i.questions || []).map(t => `<li>${t}</li>`).join(''); }
  $('#welcomeEmotional').innerHTML = i.emotional;
  // Her closing copy is two paragraphs (2026-08-10), so it goes through paras().
  // #welcomeBody is a <div> for exactly this reason — <p> inside <p> is invalid.
  $('#welcomeBody').innerHTML = paras(i.body, 'welcome-body-p');
}

// ---- EARLY PROOF: one featured, real reflection placed high (hide if none) ----
function renderEarlyProof() {
  const section = $('#proof-early');
  if (!section) return;
  const items = (content.testimonials && content.testimonials.items) || [];
  const feat = items.find(q => q.featured);
  if (!feat) { section.hidden = true; return; }   // honest: no featured quote → no section
  section.hidden = false;
  $('#proofEarlyQuote').textContent = feat.quote;
  $('#proofEarlyMeta').textContent = [feat.name, feat.service].filter(Boolean).join(' · ');
}

function renderServices() {
  $('#servicesGrid').innerHTML = content.services.map(s => {
    const priceRow = s.enquireOnly
      ? `<div class="svc-price svc-price-enquire">By enquiry</div>`
      : `<div class="svc-options">${s.options.map(o =>
          `<span class="svc-opt"><span class="svc-opt-label">${o.label}</span><span class="svc-opt-price">${priceAUD(o.price)}</span></span>`
        ).join('')}</div>`;
    // Her real photo heads the card so the sessions section is not a wall of
    // type. Eager: these two are above the fold on a laptop.
    const media = s.image ? `
      <div class="svc-media">
        <img src="${s.image}" alt="${s.imageAlt || ''}" loading="lazy" decoding="async"
             onerror="this.parentElement.remove()">
      </div>` : '';
    // Her full description lives behind the toggle. Price + duration + Book
    // stay outside it, always visible — they are the conversion path.
    const detail = disclosure('About this session', paras(s.blurb, 'svc-blurb'), 'svc-disclose');
    return `
    <article class="svc-card" data-reveal>
      <div class="svc-card-glow" aria-hidden="true"></div>
      ${media}
      <h3 class="svc-name">${s.name}</h3>
      <p class="svc-modality">${s.modality}</p>
      ${s.tagline ? `<p class="svc-tagline">${s.tagline}</p>` : ''}
      ${detail}
      ${priceRow}
      <div class="svc-cta">
        <a href="#book" class="btn ${s.enquireOnly ? 'btn-ghost' : 'btn-primary'}" data-book="${s.id}">${s.cta.label} <span class="arrow">→</span></a>
        ${s.supportsRef ? `<a href="#${s.supportsRef}" class="svc-link">What it may support →</a>` : ''}
      </div>
    </article>`;
  }).join('');
}

// Mindset coaching is an INCLUSION, not a service. Hidden if she ever removes it.
// Inclusion panels (mindset coaching, sage clearing...). Same honest-empty-state
// rule as #shop: no data, no section. Multi-paragraph blurbs go through paras()
// so Karine's own paragraph breaks survive.
function renderInclusions() {
  const list = content.inclusions || [];
  const mount = $('#inclusions');
  if (!mount) return;
  if (!list.length) { mount.hidden = true; mount.innerHTML = ''; return; }
  mount.hidden = false;
  mount.innerHTML = list.map(c => panelHtml(c)).join('');
}

// Shared panel markup for the inclusion-style blocks (mindset coaching, sage
// cleansing, psychic parties, expos). An optional real photo sits beside the
// copy, and a long blurb can be folded behind a disclosure button.
function panelHtml(c) {
  const body = paras(c.blurb, 'inclusion-p');
  const copy = c.collapsible
    ? disclosure(`Read about ${c.title}`, body, 'inclusion-disclose')
    : `<div>${body}</div>`;
  // The media block is OPTIONAL: a panel with neither `video` nor `image`
  // (mindset coaching) renders as a plain single-column panel, untouched.
  // A `video` panel is deliberately narrower than a photo panel — see the
  // .inclusion.has-video rule. Reduced motion gets the poster as a still and
  // no video element is ever created, exactly like the hero.
  let media = '';
  if (c.video) {
    media = REDUCED
      ? `<div class="inclusion-media inclusion-media--video">
           <img src="${c.poster}" alt="${c.videoAlt || ''}" decoding="async"
                onerror="this.parentElement.remove()">
         </div>`
      : `<div class="inclusion-media inclusion-media--video"
              data-inclusion-video="${c.video}"
              data-poster="${c.poster || ''}"
              data-label="${c.videoAlt || ''}"></div>`;
  } else if (c.image) {
    media = `
    <div class="inclusion-media">
      <img src="${c.image}" alt="${c.imageAlt || ''}" loading="lazy" decoding="async"
           onerror="this.parentElement.remove()">
    </div>`;
  }
  const hasMedia = !!(c.video || c.image);
  // `images[]` is the OTHER media shape: a full-width row of uncropped photos
  // under the copy, instead of one cropped photo in a side column. The expos
  // panel uses it because its shots are portrait and `.inclusion-media`'s
  // object-fit: cover would slice Karine out of both. Same rules as the
  // atmosphere grid: natural height, nothing cropped, honest empty state if a
  // file 404s (the figure removes itself, and an empty row collapses).
  const gallery = (Array.isArray(c.images) && c.images.length)
    ? `<div class="inclusion-gallery">${c.images.map(im => `
        <figure class="inclusion-shot">
          <img src="${im.src}" alt="${im.alt || ''}" loading="lazy" decoding="async"
               onerror="this.parentElement.remove()">
        </figure>`).join('')}</div>`
    : '';
  return `
    <aside class="inclusion${hasMedia ? ' has-media' : ''}${c.video ? ' has-video' : ''}" data-reveal>
      ${media}
      <div class="inclusion-body">
        ${c.eyebrow ? `<p class="eyebrow"><span class="dot"></span> ${c.eyebrow}</p>` : ''}
        <h3 class="inclusion-title">${c.title}</h3>
        ${c.emotional ? `<p class="inclusion-emotional">${c.emotional}</p>` : ''}
        ${copy}
        ${gallery}
      </div>
    </aside>`;
}

function renderReikiSupports() {
  const r = content.reikiSupports;
  $('#supportsEyebrow').innerHTML = `<span class="dot"></span> ${r.eyebrow}`;
  $('#supportsTitle').innerHTML = r.emotional;   // emotional foil line as the heading
  $('#supportsTitle').dataset.split = 'skip';    // not a word-split heading
  $('#supportsTitle').classList.remove('split');
  $('#supportsTitle').classList.add('foil-line');
  $('#supportsNote').textContent = r.note;
  $('#supportsGrid').innerHTML = r.items.map(it =>
    `<li class="support-chip" data-reveal>${it}</li>`
  ).join('');
}

function renderJourney() {
  const j = content.journey;
  $('#journeyEyebrow').innerHTML = `<span class="dot"></span> ${j.eyebrow}`;
  $('#journeyTitle').innerHTML = j.emotional;
  $('#journeyTitle').dataset.split = 'skip';
  $('#journeyTitle').classList.remove('split');
  $('#journeyTitle').classList.add('foil-line');

  $('#journeyTrack').innerHTML = j.steps.map(s => `
    <article class="journey-card" data-reveal>
      <div class="journey-step">${s.step}</div>
      <h3 class="journey-card-title">${s.title}</h3>
      <p class="journey-card-body">${s.body}</p>
    </article>
  `).join('');

  $('#journeyModes').innerHTML = j.modes.map(m => `
    <div class="mode-card" data-reveal>
      <span class="mode-glyph">${GLYPHS[m.glyph] || ''}</span>
      <div>
        <h4 class="mode-title">${m.title}</h4>
        <p class="mode-body">${m.body}</p>
      </div>
    </div>
  `).join('');
}

// ---- SHOP: checkoutUrl-or-SMS, price from single source, hide if empty ----
function shopSms(p) {
  const priceStr = p.price ? ` (${priceAUD(p.price)})` : '';
  const body = encodeURIComponent(
    `Hi Karine! I'd like to order the ${p.name} pendulum${priceStr}. My name: , Delivery postcode: `
  );
  return `${content.booking.smsHref}?&body=${body}`;
}
function productBuyHref(p)  { return p.checkoutUrl ? p.checkoutUrl : shopSms(p); }
function productBuyLabel(p) { return p.soldOut ? 'Sold out' : (p.checkoutUrl ? 'Add to cart' : 'Order by text'); }

function renderShop() {
  const s = content.shop;
  const section = $('#shop');
  if (!s || !Array.isArray(s.products) || s.products.length === 0) {
    section.hidden = true;                       // honest: no placeholders, hide until real products exist
    return;
  }
  section.hidden = false;
  $('#shopEyebrow').innerHTML = `<span class="dot"></span> ${s.eyebrow}`;
  $('#shopTitle').innerHTML = s.emotional;
  $('#shopTitle').dataset.split = 'skip';
  $('#shopTitle').classList.remove('split');
  $('#shopTitle').classList.add('foil-line');
  $('#shopNote').textContent = s.note;

  $('#shopGrid').innerHTML = s.products.map(p => {
    const href = productBuyHref(p);
    const isCart = !!p.checkoutUrl;
    // The "Prefer email?" fallback was removed 2026-08-10 at Karine's request.
    // Orders are SMS-first; her phone number is on every card's button.
    return `
    <article class="pendulum-card" data-reveal>
      <div class="pendulum-media">
        <img src="${p.image}" alt="${p.alt}" loading="lazy" onerror="this.parentElement.style.background='var(--surface-3)';this.remove()">
        ${p.soldOut ? `<span class="pendulum-flag">Sold out</span>` : ''}
      </div>
      <h3 class="pendulum-name">${p.name}</h3>
      ${p.material ? `<p class="pendulum-material">${p.material}</p>` : ''}
      ${p.blurb ? `<p class="pendulum-blurb">${p.blurb}</p>` : ''}
      ${p.price ? `<div class="pendulum-price" data-price="${p.id}">${currencyAU(p.price)} <small>AUD</small></div>` : `<div class="pendulum-price pendulum-price-enquire">Enquire to order</div>`}
      <a class="btn ${p.soldOut ? 'btn-ghost is-disabled' : 'btn-primary'}" href="${p.soldOut ? '#book' : href}"${isCart ? ' rel="nofollow"' : ''}${p.soldOut ? ' aria-disabled="true"' : ''}>${productBuyLabel(p)} <span class="arrow">→</span></a>
    </article>`;
  }).join('');
}

// ---- ATMOSPHERE / GALLERY: real photos only, hide if empty ----
function renderGallery() {
  const g = content.gallery;
  const section = $('#atmosphere');
  if (!g || !Array.isArray(g.items) || g.items.length === 0) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  $('#atmosphereEyebrow').innerHTML = `<span class="dot"></span> ${g.eyebrow}`;
  $('#atmosphereTitle').innerHTML = g.emotional;
  $('#atmosphereTitle').dataset.split = 'skip';
  $('#atmosphereTitle').classList.remove('split');
  $('#atmosphereTitle').classList.add('foil-line');
  $('#atmosphereNote').textContent = g.note;
  // No more `wide` / `tall` span classes: the grid is now a masonry column
  // layout and every tile takes the photo's own height, so nothing is cropped.
  // The old fixed 240px row + object-fit:cover was slicing her portrait shots
  // roughly in half on a laptop (see the 2026-08-10 fix).
  $('#atmosphereGrid').innerHTML = g.items.map(it => {
    const cat = (g.categories || []).find(c => c.id === it.category);
    return `
      <figure class="atmosphere-tile" data-reveal>
        <img src="${it.src}" alt="${it.alt}" loading="lazy" decoding="async" onerror="this.parentElement.remove()">
        ${cat ? `<figcaption class="tag">${cat.label}</figcaption>` : ''}
      </figure>`;
  }).join('');
}

// ---- GATHERINGS: psychic parties + psychic expos ----
// The two ways to meet Karine outside a private one-to-one session. Neither is
// priced or separately bookable, so the only action is an enquiry text.
// Same honest-empty-state rule as #shop: no items, no section.
function renderGatherings() {
  const section = $('#gatherings');
  if (!section) return;
  const g = content.gatherings;
  const items = (g && Array.isArray(g.items)) ? g.items : [];
  if (!items.length) { section.hidden = true; return; }
  section.hidden = false;
  $('#gatheringsEyebrow').innerHTML = `<span class="dot"></span> ${g.eyebrow}`;
  const title = $('#gatheringsTitle');
  title.innerHTML = g.emotional;
  title.dataset.split = 'skip';
  title.classList.remove('split');
  title.classList.add('foil-line');
  $('#gatheringsPanels').innerHTML = items.map(it => panelHtml(it)).join('');
  const cta = $('#gatheringsCta');
  cta.innerHTML = (g.cta && g.cta.label)
    ? `<a class="btn btn-primary" href="${bookingSms(g.cta.intro)}">${g.cta.label} <span class="arrow">→</span></a>`
    : '';
}

// ---- GIFT VOUCHERS ----
// Denominations are her REAL session prices, plus a free amount. There is no
// payment processing on this site, so the only action is a pre-filled SMS,
// exactly like the pendulum shop. Nothing is ever "purchased" here and there
// is no fake success state. The card on the left is a live preview of the
// voucher she sends, so "show an example of it" is answered literally.
function renderVouchers() {
  const section = $('#vouchers');
  if (!section) return;
  const v = content.vouchers;
  const opts = (v && Array.isArray(v.options)) ? v.options : [];
  if (!v || !opts.length) { section.hidden = true; return; }   // honest empty state
  section.hidden = false;

  $('#vouchersEyebrow').innerHTML = `<span class="dot"></span> ${v.eyebrow}`;
  const title = $('#vouchersTitle');
  title.innerHTML = v.emotional;
  title.dataset.split = 'skip';
  title.classList.remove('split');
  title.classList.add('foil-line');
  $('#vouchersNote').textContent = v.note;
  $('#voucherKicker').textContent = v.preview.kicker;
  $('#voucherFoot').textContent = v.preview.foot;
  $('#voucherPaymentNote').textContent = v.paymentNote;
  $('#voucherCaption').textContent = 'An example of the voucher Karine sends through.';
  if (v.custom && v.custom.hint) $('#voucherCustomHint').textContent = v.custom.hint;

  const all = opts.concat(v.custom ? [Object.assign({ isCustom: true, amount: null }, v.custom)] : []);
  $('#voucherOptions').innerHTML = all.map((o, i) => `
    <label class="bk-session${i === 0 ? ' is-selected' : ''}">
      <input type="radio" name="voucher" value="${o.id}" data-custom="${!!o.isCustom}" ${i === 0 ? 'checked' : ''}>
      <span class="bk-session-main">
        <span class="bk-session-title">${o.label}</span>
        <span class="bk-session-dur">${o.detail}</span>
      </span>
      <span class="bk-session-price">${o.amount ? priceAUD(o.amount) : 'You choose'}</span>
    </label>`).join('');

  const wrap = $('#voucherOptions');
  const customField = $('#voucherCustomField');
  const customInput = $('#voucherAmountInput');
  const forInput = $('#voucherFor');
  const fromInput = $('#voucherFrom');
  const cta = $('#voucherCta');
  const p = v.preview;

  function chosen() {
    const sel = wrap.querySelector('input[name="voucher"]:checked');
    return all.find(o => o.id === (sel && sel.value)) || all[0];
  }
  // Digits only — a voucher amount is a whole number of dollars.
  function customAmount() {
    const n = parseInt(String(customInput.value).replace(/[^0-9]/g, ''), 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  function update() {
    const o = chosen();
    const isCustom = !!o.isCustom;
    $$('.bk-session', wrap).forEach(l => l.classList.toggle('is-selected', !!l.querySelector('input:checked')));
    customField.hidden = !isCustom;
    const amount = isCustom ? customAmount() : o.amount;

    $('#voucherAmount').textContent = amount ? priceAUD(amount) : '$ —';
    $('#voucherDetail').textContent = o.detail;
    const to = forInput.value.trim();
    const from = fromInput.value.trim();
    $('#voucherLines').innerHTML = `
      <span class="voucher-line"><span class="voucher-line-label">${p.forLabel}</span><span class="voucher-line-value${to ? '' : ' is-blank'}">${to || p.forPlaceholder}</span></span>
      <span class="voucher-line"><span class="voucher-line-label">${p.fromLabel}</span><span class="voucher-line-value${from ? '' : ' is-blank'}">${from || p.fromPlaceholder}</span></span>`;

    // The label never claims an amount the visitor has not chosen.
    cta.innerHTML = `${v.cta.label}${amount ? ` · ${priceAUD(amount)}` : ''} <span class="arrow">→</span>`;
    const bits = [`I'd like to order a gift voucher: ${o.label}${amount ? ` (${priceAUD(amount)})` : ''}.`];
    if (to) bits.push(`It's for ${to}.`);
    if (from) bits.push(`It's from ${from}.`);
    cta.href = bookingSms(bits.join(' '));
  }

  wrap.addEventListener('change', update);
  [customInput, forInput, fromInput].forEach(el => el.addEventListener('input', update));
  update();
}

function renderVoices() {
  const t = content.testimonials;
  const section = $('#voices');
  // The featured quote is surfaced up top (early proof) — exclude it here so it never repeats.
  // A quote whose `name` is still a CONFIRM placeholder is held back entirely
  // (same rule renderSchema() uses for CONFIRM URLs). We will not invent an
  // attribution, and we will not pass a named public review off as anonymous.
  const gridItems = ((t && Array.isArray(t.items)) ? t.items : [])
    .filter(q => !q.featured)
    .filter(q => q.name && !/CONFIRM/.test(q.name));
  const proofPoints = (t && Array.isArray(t.proofPoints)) ? t.proofPoints : [];
  const hasReal = gridItems.length > 0;
  // Honest empty state: nothing real to show and no proof points → no section.
  if (!hasReal && proofPoints.length === 0) { section.hidden = true; return; }
  section.hidden = false;
  $('#voicesTitle').textContent = t.headline;
  if (t.subhead) $("#voicesSubhead").textContent = t.subhead;
  $("#voicesSub").innerHTML = paras(t.sub, "voices-sub-p");
  if (hasReal) {
    // Her reviewers write in paragraphs too, so quotes go through paras().
    // The container is a <div> because paras() emits <p> (no <p> inside <p>).
    //
    // ATTRIBUTION (2026-08-10): these quotes are a MIX and the difference is
    // shown, not hidden. An item with a `source` is a review the person chose to
    // publish themselves on her Facebook page, so it carries a name AND a quiet
    // source line. An item without one is private feedback texted to her, stays
    // "A recent client" and gets NO source line. That is exactly the policy
    // Karine describes in her own intro copy above the grid.
    //
    // Every card renders `is-clamped` + a Read-the-rest button; initVoiceClamp()
    // then MEASURES and strips the class off any quote that already fits, so the
    // button only ever appears where words are actually hidden.
    $('#voicesGrid').innerHTML = gridItems.map((q, i) => `
      <article class="voice-card is-clamped" data-reveal>
        <span class="voice-quote-mark" aria-hidden="true">“</span>
        <div class="voice-quote" id="voiceQuote${i}">${paras(q.quote, 'voice-quote-p')}</div>
        <button type="button" class="voice-more" aria-expanded="false" aria-controls="voiceQuote${i}">
          <span class="voice-more-label">Read the rest</span>
          <span class="voice-more-chev" aria-hidden="true"></span>
        </button>
        <div class="voice-meta">
          <span class="voice-name">${q.name}</span>
          ${q.service ? `<span class="voice-service">${q.service}</span>` : ''}
          ${q.source ? `<span class="voice-source"><span class="voice-source-dot" aria-hidden="true"></span>${q.source}</span>` : ''}
        </div>
      </article>`).join('');
  } else {
    // Honest proof points until real quotes are supplied.
    $('#voicesGrid').innerHTML = proofPoints.map(p => `
      <article class="voice-card voice-proof" data-reveal>
        <div class="voice-metric">${p.metric}</div>
        <div class="voice-label">${p.label}</div>
        <p class="voice-sub">${p.sub}</p>
      </article>`).join('');
  }
}

// ============================================================
// VOICE CLAMP — long reviews open in place, they are never cut off.
//
// The rail stretches every card to the tallest, so one 673-character review
// used to set the height for all of them (the old grid did the same thing to
// its row). The quote clamps to nine lines in CSS; this measures which quotes
// actually overflow and un-clamps the rest, then wires the toggle.
//
// Deliberately NOT a scrollable box inside the card: a nested vertical scroller
// would eat page scroll the instant a thumb landed on it, which is precisely
// what this rail must never do. Clipped text stays in the DOM and readable to
// screen readers, and the button reveals it for everyone else.
// No rAF, no ticker — a measure on load, on fonts-ready and on resize.
// ============================================================
function initVoiceClamp() {
  const track = $('#voicesGrid');
  if (!track) return;
  const cards = $$('.voice-card.is-clamped, .voice-card.is-open', track);
  if (!cards.length) return;

  const measure = () => {
    cards.forEach(card => {
      if (card.classList.contains('is-open')) return;   // user opened it; leave it
      const q = card.querySelector('.voice-quote');
      if (!q) return;
      card.classList.add('is-clamped');                  // clamp first, then look
      if (q.scrollHeight <= q.clientHeight + 4) card.classList.remove('is-clamped');
    });
  };

  track.addEventListener('click', e => {
    const btn = e.target.closest('.voice-more');
    if (!btn || !track.contains(btn)) return;
    const card = btn.closest('.voice-card');
    if (!card) return;
    const open = card.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    const label = btn.querySelector('.voice-more-label');
    if (label) label.textContent = open ? 'Show less' : 'Read the rest';
  });

  measure();
  // Cormorant is a webfont: the first measure can run against the fallback.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure).catch(() => {});
  window.addEventListener('resize', measure, { passive: true });
}

function renderAbout() {
  const a = content.about;
  const img = $('#aboutPhoto');
  img.src = a.photo;
  img.alt = `${a.name}, ${a.role}`;
  img.onerror = () => {
    img.style.display = 'none';
    img.parentElement.classList.add('is-empty');
    img.parentElement.insertAdjacentHTML('beforeend',
      `<span class="portrait-note">Portrait, supplied by Karine</span>`);
  };
  if (a.eyebrow) $("#aboutEyebrow").textContent = a.eyebrow;
  $("#aboutBio").innerHTML = paras(a.bio, "about-bio-p");
  $('#aboutSig').textContent = a.signature;
}

function renderSacred() {
  const s = content.sacredContent;
  $('#sacredEyebrow').innerHTML = `<span class="dot"></span> ${s.eyebrow}`;
  $('#sacredEmotional').innerHTML = s.emotional;
  $('#sacredBody').textContent = s.body;
  $('#sacredGrid').innerHTML = s.cards.map(c => `
    <article class="sacred-card" data-reveal>
      <span class="sacred-glyph">${GLYPHS[c.glyph] || GLYPHS.star}</span>
      <h3 class="sacred-card-title">${c.title}</h3>
      <p class="sacred-card-body">${c.body}</p>
    </article>
  `).join('');
  $('#sacredSocials').innerHTML = content.socials.map(so => `
    <a class="social-pill" href="${so.url}" target="_blank" rel="noopener">
      <span class="social-glyph">${SOCIAL_ICONS[so.id] || ''}</span>
      <span class="social-meta"><span class="social-label">${so.label}</span><span class="social-handle">${so.handle}</span></span>
    </a>
  `).join('');
}

const SOCIAL_ICONS = {
  instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></svg>`,
  facebook:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  tiktok:    `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4c.5 2.5 2 4 4.5 4.3M16 4v9.5a4.5 4.5 0 1 1-4-4.47"/></svg>`
};

function renderFaq() {
  $('#faqList').innerHTML = content.faq.map(f => `
    <details class="faq-item" data-reveal>
      <summary class="faq-q">${f.q}</summary>
      <div class="faq-a">${f.a}</div>
    </details>
  `).join('');
}

function renderCta() {
  const c = content.cta;
  $('#ctaEyebrow').innerHTML = `<span class="dot"></span> ${c.eyebrow}`;
  $('#ctaTitle').innerHTML = c.emotional;
  $('#ctaTitle').classList.remove('split');
  $('#ctaTitle').classList.add('foil-line');
  $('#ctaTitle').dataset.split = 'done';
  $('#ctaBody').textContent = c.body;
  $('#ctaCtas').innerHTML = `
    <a href="#book" class="btn btn-primary">Book a session <span class="arrow">→</span></a>
    <a href="#services" class="btn btn-ghost">See the sessions</a>
  `;
}

function renderContact() {
  const b = content.booking;
  const textHref = bookingSms("I'd like to book a session.");
  // Two channels only. The Email channel was removed 2026-08-10 at Karine's
  // request; the address it pointed at was a dead placeholder anyway.
  const channels = [
    { href: textHref, glyph: 'msg', label: 'Text Karine', value: b.phone },
    { href: b.phoneHref, glyph: 'phone', label: 'Call direct', value: b.phone }
  ];
  const chGlyph = {
    msg:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></svg>`,
    phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
  };
  $('#contactChannels').innerHTML = channels.map(c => `
    <a class="channel" href="${c.href}">
      <span class="channel-icon">${chGlyph[c.glyph]}</span>
      <div class="channel-meta">
        <span class="channel-label">${c.label}</span>
        <span class="channel-value">${c.value}</span>
      </div>
    </a>
  `).join('');
  $('#formNote').textContent = b.responseTimeLabel;
}

function renderFooter() {
  $('#footerBlurb').textContent =
    "Intuitive psychic mediumship readings and Reiki healing. In person in Gilston, or online worldwide.";
  $('#footerDirect').innerHTML = `
    <li><a href="${bookingSms("I'd like to book a session.")}">Text Karine</a></li>
    <li><a href="${content.booking.phoneHref}">${content.booking.phone}</a></li>
  `;
  $('#footerSocials').innerHTML = content.socials.map(so =>
    `<li><a href="${so.url}" target="_blank" rel="noopener">${so.label}</a></li>`
  ).join('');
  $('#footerCopy').textContent = `© ${new Date().getFullYear()} ${content.brand.name}${content.brand.abn ? ` · ABN ${content.brand.abn}` : ''}`;
  $('#footerRegion').textContent = content.brand.region;
}

function renderNav() {
  $('#navBook').href = '#book';
  $('#drawerBook').href = '#book';
  $('#floatMsg').href = '#book';
  // Remove Shop links when the shop has no real products yet.
  const shopEmpty = !content.shop || !Array.isArray(content.shop.products) || content.shop.products.length === 0;
  if (shopEmpty) $$('[data-nav="shop"]').forEach(a => a.remove());
  // Same rule for gift vouchers: no denominations, no section, no link to it.
  const vouchersEmpty = !content.vouchers || !Array.isArray(content.vouchers.options) || content.vouchers.options.length === 0;
  if (vouchersEmpty) $$('[data-nav="vouchers"]').forEach(a => (a.closest('li') || a).remove());
}

function renderSchema() {
  const b = content.brand;
  const sameAs = content.socials.map(s => s.url).filter(u => u && !/CONFIRM/.test(u));
  const business = { "@context": "https://schema.org", ...content.schema, sameAs };
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: b.name,
    jobTitle: "Psychic Medium and Reiki Healer",
    url: content.schema.url,
    worksFor: { "@type": "ProfessionalService", name: b.name },
    sameAs
  };
  const services = content.services.map(s => ({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: s.name,
    name: s.name,
    description: s.blurb,
    provider: { "@type": "ProfessionalService", name: b.name },
    areaServed: [
      { "@type": "Place", name: b.servesInPerson },
      { "@type": "Place", name: b.servesOnline }
    ],
    ...(s.options && s.options.length ? {
      offers: s.options.map(o => ({ "@type": "Offer", name: o.label, price: o.price, priceCurrency: "AUD" }))
    } : {})
  }));
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map(f => ({
      "@type": "Question", name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };
  $('#ldSchema').textContent = JSON.stringify([business, person, ...services, faq], null, 2);
}

// ============================================================
// INITIAL RENDER
// ============================================================
renderHero();
renderIntro();
renderEarlyProof();
renderServices();
renderReikiSupports();
renderInclusions();
renderJourney();
renderShop();
renderGallery();
renderGatherings();
renderVouchers();
renderVoices();
renderAbout();
renderSacred();
renderComingSoon();
renderFaq();
renderCta();
renderContact();
renderBooking();
renderFooter();
renderNav();
renderSchema();
applySplits();
initDisclosures();
initInclusionVideos();
initRails();
initVoiceClamp();

// ============================================================
// PAGE-LOAD OVERTURE
// ============================================================
function runOverture() {
  if (REDUCED) { $('#overture').remove(); return Promise.resolve(); }
  return new Promise(resolve => {
    const mark = $('#overtureMark');
    const bloom = $('#overtureBloom');
    const chars = mark.textContent.split('');
    mark.innerHTML = chars.map(c => `<span class="char">${c}</span>`).join('');
    const spans = mark.querySelectorAll('.char');

    let settled = false;
    const finish = () => { if (settled) return; settled = true; const o = $('#overture'); if (o) o.remove(); resolve(); };

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to('#overture', { opacity: 0, duration: 0.55, ease: 'power2.inOut', onComplete: finish });
      }
    });
    tl.to(bloom, { scale: 1, duration: 0.8, ease: 'power3.out' }, 0)
      .to(spans, { opacity: 1, y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, 0.2)
      .to(bloom, { opacity: 0.5, scale: 1.4, duration: 0.5, ease: 'power2.inOut' }, 0.9);

    // Safety net — never let the overture trap the page if GSAP stalls.
    setTimeout(finish, 2600);
  });
}

// ============================================================
// LENIS + SCROLLTRIGGER BRIDGE (single ticker raf; touch → native)
// ============================================================
const lenis = new Lenis({
  lerp: 0.09,              // continuous inertia — a buttery, premium glide (client's #1 ask)
  smoothWheel: true,
  syncTouch: false,        // touch hands scrolling back to the OS — no JS fighting the finger
  wheelMultiplier: 1,
  touchMultiplier: 1.6
});

if (window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  if (!NO_HOVER) ScrollTrigger.normalizeScroll(true);   // desktop only — hijacks touch otherwise
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));       // SINGLE raf source
  gsap.ticker.lagSmoothing(0);
} else {
  function rafLoop(time) { lenis.raf(time); requestAnimationFrame(rafLoop); }
  requestAnimationFrame(rafLoop);
}

// Anchor-link smooth scroll via Lenis. Reads the href INSIDE the handler and
// bails on non-hash links so tel:/sms:/mailto: buttons never get hijacked.
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (!id || id === '#' || id.length < 2) return;
  const target = document.querySelector(id);
  if (!target || target.hidden) return;
  e.preventDefault();
  if (lenis && lenis.scrollTo) {
    lenis.scrollTo(target, { offset: -60, duration: NO_HOVER ? 0.6 : 1.2 });
  } else {
    const y = target.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  closeDrawer();
});

// ============================================================
// NAV / DRAWER / FLOAT
// ============================================================
const nav = $('#nav');
const burger = $('#burger');
const drawer = $('#drawer');

function openDrawer() {
  drawer.classList.add('is-open');
  drawer.removeAttribute('inert');
  drawer.setAttribute('aria-hidden', 'false');
  burger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  if (lenis && lenis.stop) lenis.stop();
  const first = drawer.querySelector('a');
  if (first) first.focus();
}
function closeDrawer() {
  if (!drawer.classList.contains('is-open')) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('inert', '');
  drawer.setAttribute('aria-hidden', 'true');
  burger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  if (lenis && lenis.start) lenis.start();
}
burger.addEventListener('click', () => {
  (burger.getAttribute('aria-expanded') === 'true') ? closeDrawer() : openDrawer();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && drawer.classList.contains('is-open')) { closeDrawer(); burger.focus(); }
});

window.addEventListener('scroll', () => {
  nav.classList.toggle('is-scrolled', window.scrollY > 30);
  $('#floatMsg').classList.toggle('is-visible', window.scrollY > 600);
}, { passive: true });

// ============================================================
// CURSOR GLOW + MAGNETIC CTAS (desktop only)
// ============================================================
if (!NO_HOVER && !REDUCED) {
  const glow = $('#cursorGlow');
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.body.classList.add('has-cursor');
  window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
    glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  $$('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.15;
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ============================================================
// STAR-TRAIL CURSOR + 3D CARD TILT (desktop signature layer, FX only)
// ============================================================
if (FX) {
  // Soft star dust that trails the cursor — throttled + self-cleaning (low churn).
  let lastStar = 0, flip = 0;
  window.addEventListener('mousemove', e => {
    const now = performance.now();
    if (now - lastStar < 70) return;
    lastStar = now;
    const s = document.createElement('div');
    s.className = 'cursor-star' + ((flip++ % 2) ? ' rose' : '');
    const size = (4.5 + Math.random() * 4).toFixed(1);
    s.style.left = (e.clientX + (Math.random() - 0.5) * 12) + 'px';
    s.style.top  = (e.clientY + (Math.random() - 0.5) * 12) + 'px';
    s.style.width = s.style.height = size + 'px';
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }, { passive: true });

  // Subtle 3D tilt + pointer-tracked glow on the richer cards.
  $$('.svc-card, .pendulum-card, .voice-card').forEach(card => {
    const isSvc = card.classList.contains('svc-card');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--rx', ((0.5 - py) * 6).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((px - 0.5) * 7).toFixed(2) + 'deg');
      if (isSvc) {
        card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

// ============================================================
// IO REVEALS (with 1.5s failsafe)
// ============================================================
const revealEls = $$('[data-reveal], .split, .divider, .foil-line, .stagger');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => {
  const r = el.getBoundingClientRect();
  if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
  else io.observe(el);
});
setTimeout(() => {
  $$('[data-reveal]:not(.is-in), .split:not(.is-in), .foil-line:not(.is-in), .stagger:not(.is-in)').forEach(el => el.classList.add('is-in'));
}, 1500);

// ============================================================
// HERO CONTENT PARALLAX (desktop / non-reduced)
// ============================================================
if (window.ScrollTrigger && !REDUCED) {
  gsap.to('#heroContent', {
    yPercent: -10, opacity: 0.5, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });
  // Multi-plane depth: the hero video plane drifts slower than the content.
  // Overscan (scale) hides the edges while it travels. Desktop only.
  if (FX) {
    gsap.fromTo('#heroMedia',
      { yPercent: -5, scale: 1.06 },
      { yPercent: 9, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });
  }
  // Atmosphere tile float — desktop only (one scrub per image is costly on touch).
  // Moves the TILE, not the image inside it: the tiles now hug the photo's own
  // height (nothing is cropped), so translating the <img> would have opened a
  // sliver of empty tile at the top or bottom.
  if (!NO_HOVER) {
    $$('.atmosphere-tile').forEach(tile => {
      gsap.fromTo(tile, { y: -8 }, { y: 8, ease: 'none',
        scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
    });
  }
}

// ============================================================
// JOURNEY — HORIZONTAL PINNED (desktop ≥1025 only; stacks on touch/mobile)
// ============================================================
function initJourneyTimeline() {
  if (window.innerWidth < 1025 || NO_HOVER || REDUCED || !window.ScrollTrigger) return;
  const track = $('#journeyTrack');
  const wrap = $('#journeyTrackWrap');
  if (!track || !wrap) return;
  const distance = track.scrollWidth - wrap.offsetWidth + 80;
  if (distance <= 0) return;
  gsap.to(track, {
    x: -distance, ease: 'none',
    scrollTrigger: {
      trigger: wrap, start: 'top top',
      end: () => `+=${distance + window.innerHeight * 0.4}`,
      pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true
    }
  });
}
initJourneyTimeline();

// ============================================================
// SUNLIT DUST MOTES — canvas 2D, desktop only.
// The golden-hour answer to the old starfield: soft warm bokeh drifting on
// the sea breeze, with an occasional slow lens flare. Same cheap scaffold
// (DPR clamp, deterministic scatter, pauses off-screen); motes are drawn
// from one pre-rendered sprite rather than a per-frame gradient, so 150 of
// them still cost one drawImage each.
// ============================================================
function initMotes() {
  if (REDUCED || NO_HOVER || window.innerWidth < 1025) return;   // mobile shows the static CSS glints only
  const canvas = $('#heroMotes');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Colour comes from the --mote design token so a theme change carries here too.
  const tokenRaw = getComputedStyle(document.documentElement).getPropertyValue('--mote').trim();
  const rgb = (tokenRaw.match(/\d+\s*,\s*\d+\s*,\s*\d+/) || ['198, 150, 74'])[0];

  // Pre-rendered soft bokeh sprite: warm core fading to nothing at the edge.
  const SPR = 48;
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = SPR;
  const sctx = sprite.getContext('2d');
  const sg = sctx.createRadialGradient(SPR / 2, SPR / 2, 0, SPR / 2, SPR / 2, SPR / 2);
  sg.addColorStop(0, `rgba(255, 213, 148, 0.95)`);
  sg.addColorStop(0.35, `rgba(${rgb}, 0.55)`);
  sg.addColorStop(1, `rgba(${rgb}, 0)`);
  sctx.fillStyle = sg; sctx.fillRect(0, 0, SPR, SPR);

  let motes = [], flareT = 0, running = true, w = 0, h = 0;
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.max(1, w * DPR); canvas.height = Math.max(1, h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const count = Math.min(110, Math.floor(w * h / 13000));
    motes = Array.from({ length: count }, (_, i) => ({
      x: (i * 97.13) % w,                         // deterministic scatter (no Math.random dependency)
      y: (i * 61.7) % h,
      r: 2.2 + ((i * 13) % 10) / 10 * 6,          // bokeh orbs, not pin-prick stars
      base: 0.10 + ((i * 7) % 10) / 10 * 0.26,
      tw: 0.25 + ((i * 3) % 10) / 10 * 0.7,       // slow breathing, not a twinkle
      ph: (i % 12) / 12 * Math.PI * 2,            // phase
      drift: 0.05 + ((i * 5) % 10) / 10 * 0.10,   // sideways on the breeze
      bob: 0.12 + ((i * 11) % 10) / 10 * 0.22     // lazy vertical float
    }));
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  const sObs = new IntersectionObserver(es => { running = es[0].isIntersecting; });
  sObs.observe($('#hero'));

  let flare = null;
  function frame(t) {
    if (running) {
      const time = t * 0.001;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        const a = m.base * (0.6 + 0.4 * Math.sin(time * m.tw + m.ph));
        m.x -= m.drift; if (m.x < -m.r) m.x = w + m.r;      // gentle leftward drift
        const y = m.y + Math.sin(time * m.bob + m.ph) * 6;  // float on the air
        ctx.globalAlpha = a;
        ctx.drawImage(sprite, m.x - m.r, y - m.r, m.r * 2, m.r * 2);
      }
      ctx.globalAlpha = 1;
      // Occasional slow lens flare drifting through the sun path
      if (!flare && time > flareT) {
        flareT = time + 9 + (Math.floor(time) % 6);
        flare = { x: w * 0.42 + (time % 1) * w * 0.24, y: h * 0.34 + (time % 0.7) * h * 0.2, life: 0 };
      }
      if (flare) {
        flare.life += 0.0045; flare.x += 0.22; flare.y -= 0.09;
        const fa = Math.sin(Math.min(1, flare.life) * Math.PI) * 0.30;   // fade in then out
        const R = 90;
        ctx.globalAlpha = Math.max(0, fa);
        ctx.drawImage(sprite, flare.x - R, flare.y - R, R * 2, R * 2);
        ctx.globalAlpha = 1;
        if (flare.life >= 1) flare = null;
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ============================================================
// COMING SOON — recorded meditations + workshops
// ============================================================
function renderComingSoon() {
  const c = content.comingSoon;
  const section = $('#comingSoon');
  if (!c || !section) { if (section) section.hidden = true; return; }
  $('#csEyebrow').innerHTML = `<span class="dot"></span> ${c.eyebrow}`;
  $('#csEmotional').innerHTML = c.emotional;
  $('#csGrid').innerHTML = c.items.map(it => `
    <article class="cs-card" data-reveal>
      <span class="cs-glyph">${GLYPHS[it.glyph] || GLYPHS.star}</span>
      <h3 class="cs-title">${it.title}<span class="cs-badge">Coming soon</span></h3>
      <p class="cs-body">${it.body}</p>
    </article>`).join('');
  $('#csCta').innerHTML = `<a href="${bookingSms(c.cta.intro)}" class="btn btn-ghost">${c.cta.label} <span class="arrow">→</span></a>`;
}

// ============================================================
// BOOKING BUILDER — session + format + days/times + focus → pre-filled SMS
// ============================================================
function bookingSessions() {
  const out = [];
  content.services.forEach(s => {
    const kind = s.id === 'reiki' ? 'Reiki healing' : (s.id === 'coaching' ? 'Mindset coaching' : 'Reading');
    if (s.options && s.options.length) {
      s.options.forEach(o => out.push({ id: `${s.id}-${o.price}`, serviceId: s.id, title: kind, duration: o.label, price: o.price, inPersonOnly: s.id === 'reiki' }));
    } else {
      out.push({ id: s.id, serviceId: s.id, title: kind, duration: '', price: null, enquire: true, inPersonOnly: false });
    }
  });
  return out;
}
function sessionLabel(s) {
  if (!s) return 'a session';
  return `${s.title}${s.duration ? ' · ' + s.duration : ''}${s.enquire || !s.price ? '' : ' (' + priceAUD(s.price) + ')'}`;
}
function renderBooking() {
  const wrap = $('#bkSessions');
  const form = $('#bookingForm');
  if (!wrap || !form) return;
  const sessions = bookingSessions();
  wrap.innerHTML = sessions.map((s, i) => `
    <label class="bk-session${i === 0 ? ' is-selected' : ''}">
      <input type="radio" name="session" value="${s.id}" data-service="${s.serviceId}" data-inperson="${s.inPersonOnly}" ${i === 0 ? 'checked' : ''}>
      <span class="bk-session-main">
        <span class="bk-session-title">${s.title}</span>
        ${s.duration ? `<span class="bk-session-dur">${s.duration}</span>` : ''}
        ${s.inPersonOnly ? `<span class="bk-session-note">In person only</span>` : ''}
      </span>
      <span class="bk-session-price">${s.enquire || !s.price ? 'Enquire' : priceAUD(s.price)}</span>
    </label>`).join('');

  const b = content.booking;

  // Platform choice — only relevant once Online is picked.
  $('#bkPlatformOpts').innerHTML = (b.platforms || []).map((p, i) => `
    <label class="bk-radio"><input type="radio" name="platform" value="${p}" ${i === 0 ? 'checked' : ''}><span>${p}</span></label>`).join('');

  // Day × time-of-day grid. Karine asked for specific slots, not a free-text
  // "Saturday morning" - she wants to see exactly which days suit.
  $('#bkWhen').style.setProperty('--bk-parts', (b.dayParts || []).length);
  $('#bkWhen').innerHTML = `
    <div class="bk-when-head"><span></span>${(b.dayParts || []).map(p => `<span>${p}</span>`).join('')}</div>
    ${(b.days || []).map(d => {
      // A day is either a plain string (all parts) or { name, parts } when her
      // real hours only cover some of them — weekends are afternoon-only.
      const name = typeof d === 'string' ? d : d.name;
      const open = typeof d === 'string' ? (b.dayParts || []) : (d.parts || []);
      return `
      <div class="bk-when-row">
        <span class="bk-when-day">${name}</span>
        ${(b.dayParts || []).map(p => open.includes(p) ? `
          <label class="bk-slot">
            <input type="checkbox" name="when" value="${name} ${p.toLowerCase()}" aria-label="${name} ${p.toLowerCase()}">
            <span></span>
          </label>` : `
          <span class="bk-slot bk-slot--closed" aria-hidden="true"></span>`).join('')}
      </div>`;
    }).join('')}
    ${b.hoursNote ? `<p class="bk-hours-note">${b.hoursNote}</p>` : ''}`;

  $('#bkFocus').placeholder = b.focusPlaceholder || '';
  $('#bkSelfie').textContent = b.selfieNote || '';
  if (b.payment) {
    $('#bkPayment').innerHTML = `
      <h3>${b.payment.heading}</h3>
      <ul>
        <li>${b.payment.inPerson}</li>
        <li>${b.payment.online}</li>
        <li>${b.payment.methods}</li>
      </ul>`;
  }

  const radios = $$('#bkFormat input');
  const online = radios.find(r => /Online/i.test(r.value));
  const inperson = radios.find(r => /person/i.test(r.value));
  const hint = $('#bkFormatHint');
  const platformBox = $('#bkPlatform');

  function applySelection() {
    const sel = wrap.querySelector('input[name="session"]:checked');
    $$('.bk-session', wrap).forEach(l => l.classList.toggle('is-selected', l.contains(sel)));
    const inPersonOnly = sel && sel.dataset.inperson === 'true';
    if (inPersonOnly && online && inperson) {
      inperson.checked = true;
      online.disabled = true;
      online.closest('.bk-radio').classList.add('is-disabled');
      hint.textContent = 'Reiki healing is held in person in Gilston only.';
    } else if (online) {
      online.disabled = false;
      online.closest('.bk-radio').classList.remove('is-disabled');
      hint.textContent = 'Readings are available in person, or online worldwide.';
    }
    // Platform only matters for an online session.
    if (platformBox) platformBox.hidden = !(online && online.checked && !online.disabled);
  }
  wrap.addEventListener('change', applySelection);
  $('#bkFormat').addEventListener('change', applySelection);
  applySelection();

  // Pre-select a session when a service card's "Book" button is tapped.
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-book]');
    if (!a) return;
    const match = wrap.querySelector(`input[data-service="${a.dataset.book}"]`);
    if (match) { match.checked = true; applySelection(); }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const sel = wrap.querySelector('input[name="session"]:checked');
    const s = sessions.find(x => x.id === (sel && sel.value));
    let fmt = (form.querySelector('input[name="format"]:checked') || {}).value || '';
    // Fold the chosen platform into the format line when the session is online.
    const isOnline = /online/i.test(fmt);
    const platform = (form.querySelector('input[name="platform"]:checked') || {}).value || '';
    if (isOnline && platform) fmt = `Online via ${platform}`;
    const when = $$('input[name="when"]:checked', form).map(i => i.value).join(', ');
    const focus = form.focus.value.trim();
    const questions = form.questions.value.trim();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    let body = `Hi Karine! I'd like to book: ${sessionLabel(s)}. Format: ${fmt}.`;
    if (when) body += ` Times that suit me: ${when}.`;
    if (focus) body += ` I'd love you to focus on: ${focus}.`;
    if (questions) body += ` My questions: ${questions}.`;
    body += ` My name: ${name || '-'}${phone ? ', phone: ' + phone : ''}.`;
    body += ` (Selfie attached.)`;
    window.location.href = `${content.booking.smsHref}?&body=${encodeURIComponent(body)}`;
  });
}

// ============================================================
// SCROLL PENDULUM — the signature moment. Karine's REAL pendulum hangs in
// the welcome band and swings from the momentum of your scroll, then settles
// back to true when you stop. Damped spring, not a simulation: the pivot only
// moves vertically in reality, so this is a designed response, tuned to feel
// like the pendulum is reading you.
//
// ⚠️ Integrated on the SAME gsap.ticker that drives Lenis. Never add a second
// requestAnimationFrame here — that is the mobile-smoothness ship blocker.
// ============================================================
function initScrollPendulum() {
  const host = $('#welcome');
  if (!host || REDUCED || !window.gsap) return;

  const wrap = document.createElement('div');
  wrap.className = 'swing';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = '<img class="swing-img" src="assets/hero/pendulum-cutout.webp" alt="" decoding="async">';
  host.appendChild(wrap);

  // Degrees of travel either side.
  //
  // ⚠️ THIS NUMBER IS GEOMETRICALLY TIED TO `.swing`'s `right` OFFSET IN CSS.
  // The image is much taller than it is wide, so at angle θ its bottom tip
  // sweeps sideways by height·sinθ. At the old 15° that was 139px of travel on
  // a pendulum sitting only 72px from the edge of the band, and
  // `.welcome { overflow: hidden }` sliced 65.6px off the crystal cone at the
  // far end of every swing.
  // The cutout was re-matted on 2026-08-11 (288x1082, whole pendulum, 24px of
  // transparent margin all round) so the clearance was re-measured against the
  // real alpha rather than the box: at 15° the content reaches 122.0px right of
  // the pivot with 185.8px of room. CSS reserves `--swing-w * 1` for that — see
  // the long note on `.swing` in styles.css before touching either number.
  // Phones cannot spare that much width, so the arc is tightened there instead.
  // Change one, recheck the other.
  //
  // ⚠️ MAX CLAMPS THE TARGET, NOT THE ANGLE. The spring below overshoots its
  // target by up to 1.495x before it settles, so the real travel is ±22.43° on
  // desktop and ±11.96° on mobile, not ±15/±8. That is an asymptote — no scroll
  // speed goes past it. Measure any arc-clearance change at the overshoot
  // figure; measuring at MAX under-reserves by a third.
  const MAX = window.innerWidth <= 640 ? 8 : 15;
  let angle = 0, vel = 0, smoothed = 0, lastY = window.scrollY, visible = false;

  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { rootMargin: '120px' });
  io.observe(host);

  gsap.ticker.add(() => {
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;
    if (!visible) return;                       // no work while it is off-screen
    smoothed += (dy - smoothed) * 0.2;          // ease the raw delta so it never jitters
    const target = Math.max(-MAX, Math.min(MAX, smoothed * 0.55));
    vel += (target - angle) * 0.06;             // spring toward where the scroll pushes it
    vel *= 0.9;                                 // damping, so it settles instead of ringing
    angle += vel;
    wrap.style.setProperty('--a', angle.toFixed(3) + 'deg');
  });
}

// ============================================================
// RISING-SUN SCROLL DIAL — the golden-hour progress motif (desktop / FX)
// A gold sun that rises as you journey down the page.
// ============================================================
function initSunDial() {
  if (!FX) return;
  const dial = document.createElement('div');
  dial.className = 'sun-dial'; dial.setAttribute('aria-hidden', 'true');
  dial.innerHTML = '<div class="sun-disc"><div class="sun-shadow"></div></div>';
  document.body.appendChild(dial);
  const shadow = dial.querySelector('.sun-shadow');
  requestAnimationFrame(() => dial.classList.add('is-ready'));
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    shadow.style.setProperty('--p', p.toFixed(3));
  }
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

// ============================================================
// SHORELINE — a flowing horizon line drawn behind the closing CTA.
// The daylight replacement for the old constellation: same draw-on
// machinery, a curve instead of a star map, with three sun glints
// resting on it. Draws once as it enters view; static + visible
// under reduced motion.
// ============================================================
function initConstellation() {
  const cta = $('#cta');
  if (!cta) return;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'constellation');
  svg.setAttribute('viewBox', '0 0 1200 520');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.setAttribute('aria-hidden', 'true');
  // A long, lazy shoreline sweep. The glints sit ON the curve, so if you
  // retune the bezier move these with it.
  // Sits low in the viewBox so it reads as a horizon under the copy rather
  // than a line through it. Glints are points ON the curve; move them with it.
  const d = 'M -40 470 C 220 412, 430 522, 660 462 S 1010 372, 1240 430';
  const glints = [[321, 467], [660, 462], [950, 402]];
  svg.innerHTML =
    `<path class="c-line" d="${d}"></path>` +
    glints.map(p => `<circle class="c-star" cx="${p[0]}" cy="${p[1]}" r="3.6"></circle>`).join('');
  cta.insertBefore(svg, cta.firstChild);
  const line = svg.querySelector('.c-line');
  if (line.getTotalLength) line.style.setProperty('--len', Math.ceil(line.getTotalLength()));
  const cio = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { svg.classList.add('is-in'); cio.disconnect(); } });
  }, { threshold: 0.25 });
  cio.observe(cta);
}

// ============================================================
// KICK OFF
// ============================================================
initMotes();
initSunDial();
initConstellation();
initScrollPendulum();

runOverture().then(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });

let resizeT;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 200);
});
