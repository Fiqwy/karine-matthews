// ============================================================
// KARINE S. MATTHEWS — APP SCRIPT
// Renders from content.js, wires Lenis + GSAP, celestial motion layer.
// Booking is SMS-first: every Book / Text / Order button resolves to
// a pre-filled sms: message (no server, no fake-success forms).
// ============================================================
import { content } from './content.js';

const REDUCED  = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NO_HOVER = matchMedia('(hover: none)').matches;
// FX = the desktop-only signature layer (tilt, cursor trail, moon dial, parallax,
// continuous shimmer/aurora). Hard-gated so the phone stays pristine.
const FX = !REDUCED && !NO_HOVER && window.innerWidth >= 1025;
document.documentElement.classList.add('has-js');
if (FX) document.documentElement.classList.add('fx');

function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

// Currency — plain AUD, no decimals (prices are whole dollars).
function currencyAU(n) { return '$' + Number(n).toLocaleString('en-AU'); }

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
  $('#heroEyebrow span:last-child').textContent = h.eyebrow;

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
  $('#welcomeBody').textContent = i.body;
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
          `<span class="svc-opt"><span class="svc-opt-label">${o.label}</span><span class="svc-opt-price">${currencyAU(o.price)}</span></span>`
        ).join('')}</div>`;
    return `
    <article class="svc-card" data-reveal>
      <div class="svc-card-glow" aria-hidden="true"></div>
      <h3 class="svc-name">${s.name}</h3>
      <p class="svc-modality">${s.modality}</p>
      <p class="svc-blurb">${s.blurb}</p>
      ${priceRow}
      <div class="svc-cta">
        <a href="#book" class="btn ${s.enquireOnly ? 'btn-ghost' : 'btn-primary'}" data-book="${s.id}">${s.cta.label} <span class="arrow">→</span></a>
        ${s.supportsRef ? `<a href="#${s.supportsRef}" class="svc-link">What it may support →</a>` : ''}
      </div>
    </article>`;
  }).join('');
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
  const priceStr = p.price ? ` (${currencyAU(p.price)} AUD)` : '';
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
    const emailPrice = p.price ? ' (' + currencyAU(p.price) + ' AUD)' : '';
    const emailHref = `mailto:${content.booking.email}?subject=${encodeURIComponent('Pendulum order: ' + p.name)}&body=${encodeURIComponent("Hi Karine, I'd like to order the " + p.name + ' pendulum' + emailPrice + '.')}`;
    return `
    <article class="pendulum-card" data-reveal>
      <div class="pendulum-media">
        <img src="${p.image}" alt="${p.alt}" loading="lazy" onerror="this.parentElement.style.background='var(--bg-elev)';this.remove()">
        ${p.soldOut ? `<span class="pendulum-flag">Sold out</span>` : ''}
      </div>
      <h3 class="pendulum-name">${p.name}</h3>
      ${p.material ? `<p class="pendulum-material">${p.material}</p>` : ''}
      ${p.blurb ? `<p class="pendulum-blurb">${p.blurb}</p>` : ''}
      ${p.price ? `<div class="pendulum-price" data-price="${p.id}">${currencyAU(p.price)} <small>AUD</small></div>` : `<div class="pendulum-price pendulum-price-enquire">Enquire to order</div>`}
      <a class="btn ${p.soldOut ? 'btn-ghost is-disabled' : 'btn-primary'}" href="${p.soldOut ? '#book' : href}"${isCart ? ' rel="nofollow"' : ''}${p.soldOut ? ' aria-disabled="true"' : ''}>${productBuyLabel(p)} <span class="arrow">→</span></a>
      ${p.soldOut ? '' : `<a class="pendulum-email" href="${emailHref}">Prefer email?</a>`}
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
  $('#atmosphereGrid').innerHTML = g.items.map((it, i) => {
    const cls = i % 5 === 2 ? 'wide' : (i % 7 === 4 ? 'tall' : '');
    const cat = (g.categories || []).find(c => c.id === it.category);
    return `
      <figure class="atmosphere-tile ${cls}" data-reveal>
        <img src="${it.src}" alt="${it.alt}" loading="lazy" onerror="this.parentElement.style.background='var(--bg-elev)';this.remove()">
        ${cat ? `<figcaption class="tag">${cat.label}</figcaption>` : ''}
      </figure>`;
  }).join('');
}

function renderVoices() {
  const t = content.testimonials;
  $('#voicesTitle').textContent = t.headline;
  $('#voicesSub').textContent = t.sub;
  // The featured quote is surfaced up top (early proof) — exclude it here so it never repeats.
  const gridItems = (Array.isArray(t.items) ? t.items : []).filter(q => !q.featured);
  const hasReal = gridItems.length > 0;
  if (hasReal) {
    $('#voicesGrid').innerHTML = gridItems.map(q => `
      <article class="voice-card" data-reveal>
        <span class="voice-quote-mark" aria-hidden="true">“</span>
        <p class="voice-quote">${q.quote}</p>
        <div class="voice-meta">
          <span class="voice-name">${q.name}</span>
          ${q.service ? `<span class="voice-service">${q.service}</span>` : ''}
        </div>
      </article>`).join('');
  } else {
    // Honest proof points until real quotes are supplied.
    $('#voicesGrid').innerHTML = t.proofPoints.map(p => `
      <article class="voice-card voice-proof" data-reveal>
        <div class="voice-metric">${p.metric}</div>
        <div class="voice-label">${p.label}</div>
        <p class="voice-sub">${p.sub}</p>
      </article>`).join('');
  }
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
  $('#aboutBio').textContent = a.bio;
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
  const channels = [
    { href: textHref, glyph: 'msg', label: 'Text Karine', value: b.phone },
    { href: b.phoneHref, glyph: 'phone', label: 'Call direct', value: b.phone },
    { href: `mailto:${b.email}`, glyph: 'mail', label: 'Email', value: b.email }
  ];
  const chGlyph = {
    msg:   `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z"/></svg>`,
    phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    mail:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`
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
    "Intuitive psychic and mediumship readings, Reiki healing and mindset coaching. In person in Gilston, or online worldwide.";
  $('#footerDirect').innerHTML = `
    <li><a href="${bookingSms("I'd like to book a session.")}">Text Karine</a></li>
    <li><a href="${content.booking.phoneHref}">${content.booking.phone}</a></li>
    <li><a href="mailto:${content.booking.email}">${content.booking.email}</a></li>
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
}

function renderSchema() {
  const b = content.brand;
  const sameAs = content.socials.map(s => s.url).filter(u => u && !/CONFIRM/.test(u));
  const business = { "@context": "https://schema.org", ...content.schema, sameAs };
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: b.name,
    jobTitle: "Psychic Medium, Reiki Healer and Mindset Coach",
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
renderJourney();
renderShop();
renderGallery();
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
    s.className = 'cursor-star' + ((flip++ % 2) ? ' amethyst' : '');
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
    yPercent: -10, opacity: 0.35, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });
  // Multi-plane depth: the celestial video plane drifts slower than the content.
  // Overscan (scale) hides the edges while it travels. Desktop only.
  if (FX) {
    gsap.fromTo('#heroMedia',
      { yPercent: -5, scale: 1.06 },
      { yPercent: 9, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.8 } });
  }
  // Atmosphere tile float — desktop only (one scrub per image is costly on touch).
  if (!NO_HOVER) {
    $$('.atmosphere-tile img').forEach(img => {
      gsap.fromTo(img, { y: -8 }, { y: 8, ease: 'none',
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
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
// CELESTIAL STARFIELD — canvas 2D, desktop only (replaces WebGL shader)
// Cheap: drifting + twinkling stars, occasional shooting star. Pauses off-screen.
// ============================================================
function initStarfield() {
  if (REDUCED || NO_HOVER || window.innerWidth < 1025) return;   // mobile shows the static CSS starfield only
  const canvas = $('#heroStars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let stars = [], shootT = 0, running = true, w = 0, h = 0;
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.max(1, w * DPR); canvas.height = Math.max(1, h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const count = Math.min(150, Math.floor(w * h / 9000));
    stars = Array.from({ length: count }, (_, i) => ({
      x: (i * 97.13) % w,                         // deterministic scatter (no Math.random dependency)
      y: (i * 61.7) % h,
      r: 0.4 + ((i * 13) % 10) / 10 * 1.1,
      base: 0.25 + ((i * 7) % 10) / 10 * 0.5,
      tw: 0.6 + ((i * 3) % 10) / 10 * 1.6,        // twinkle speed
      ph: (i % 12) / 12 * Math.PI * 2,            // phase
      drift: 0.02 + ((i * 5) % 10) / 10 * 0.05
    }));
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

  const sObs = new IntersectionObserver(es => { running = es[0].isIntersecting; });
  sObs.observe($('#hero'));

  let shoot = null;
  function frame(t) {
    if (running) {
      const time = t * 0.001;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = s.base * (0.55 + 0.45 * Math.sin(time * s.tw + s.ph));
        s.x -= s.drift; if (s.x < -2) s.x = w + 2;   // gentle leftward drift
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246, 242, 251, ${a.toFixed(3)})`;
        ctx.fill();
      }
      // Occasional shooting star
      if (!shoot && time > shootT) {
        shootT = time + 6 + (Math.floor(time) % 5);
        shoot = { x: w * 0.15 + (time % 1) * w * 0.6, y: h * 0.1 + (time % 0.7) * h * 0.3, life: 0 };
      }
      if (shoot) {
        shoot.life += 0.02; shoot.x += 6; shoot.y += 2.2;
        const gA = Math.max(0, 1 - shoot.life);
        const grad = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - 60, shoot.y - 22);
        grad.addColorStop(0, `rgba(232, 197, 131, ${(0.8 * gA).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(232, 197, 131, 0)');
        ctx.strokeStyle = grad; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x - 60, shoot.y - 22); ctx.stroke();
        if (shoot.life >= 1) shoot = null;
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ============================================================
// VIDEO FEATURE — real pendulum footage (muted loop; poster under reduced-motion)
// ============================================================
function renderVideoFeature() {
  const v = content.videoFeature;
  const section = $('#videoFeature');
  if (!v || !section) { if (section) section.hidden = true; return; }
  $('#vfEyebrow').innerHTML = `<span class="dot"></span> ${v.eyebrow}`;
  $('#vfEmotional').innerHTML = v.emotional;
  $('#vfCaption').textContent = v.caption;
  const media = $('#videoFeatureMedia');
  if (v.poster) media.style.backgroundImage = `url(${v.poster})`;
  if (!REDUCED && v.video) {
    const vid = document.createElement('video');
    vid.className = 'vf-video';
    vid.muted = true; vid.defaultMuted = true; vid.loop = true; vid.autoplay = true; vid.playsInline = true;
    vid.setAttribute('muted', ''); vid.setAttribute('playsinline', ''); vid.setAttribute('autoplay', '');
    vid.setAttribute('loop', ''); vid.setAttribute('preload', 'metadata');
    if (v.poster) vid.poster = v.poster;
    vid.src = v.video;
    media.appendChild(vid);
    const p = vid.play(); if (p && typeof p.catch === 'function') p.catch(() => {});
  }
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
  return `${s.title}${s.duration ? ' · ' + s.duration : ''}${s.enquire || !s.price ? '' : ' (' + currencyAU(s.price) + ')'}`;
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
      </span>
      <span class="bk-session-price">${s.enquire || !s.price ? 'Enquire' : currencyAU(s.price)}</span>
    </label>`).join('');

  const radios = $$('#bkFormat input');
  const online = radios.find(r => /Online/i.test(r.value));
  const inperson = radios.find(r => /person/i.test(r.value));
  const hint = $('#bkFormatHint');

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
      hint.textContent = 'Readings and mindset coaching are available in person, or online worldwide.';
    }
  }
  wrap.addEventListener('change', applySelection);
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
    const fmt = (form.querySelector('input[name="format"]:checked') || {}).value || '';
    const when = form.when.value.trim();
    const focus = form.focus.value.trim();
    const questions = form.questions.value.trim();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    let body = `Hi Karine! I'd like to book: ${sessionLabel(s)}. Format: ${fmt}.`;
    if (when) body += ` Preferred days/times: ${when}.`;
    if (focus) body += ` I'd love you to focus on: ${focus}.`;
    if (questions) body += ` My questions: ${questions}.`;
    body += ` My name: ${name || '-'}${phone ? ', mobile: ' + phone : ''}.`;
    window.location.href = `${content.booking.smsHref}?&body=${encodeURIComponent(body)}`;
  });
}

// ============================================================
// WAXING-MOON SCROLL DIAL — the celestial progress motif (desktop / FX)
// A gold moon that fills with light from new → full as you journey down.
// ============================================================
function initMoonDial() {
  if (!FX) return;
  const dial = document.createElement('div');
  dial.className = 'moon-dial'; dial.setAttribute('aria-hidden', 'true');
  dial.innerHTML = '<div class="moon-disc"><div class="moon-shadow"></div></div>';
  document.body.appendChild(dial);
  const shadow = dial.querySelector('.moon-shadow');
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
// CONSTELLATION — a "connect the stars" line-draw behind the closing CTA.
// Draws once as it enters view; static + visible under reduced motion.
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
  const pts = [[130,150],[330,90],[520,200],[770,120],[960,220],[1080,110]];
  const d = 'M' + pts.map(p => p.join(' ')).join(' L ');
  svg.innerHTML =
    `<path class="c-line" d="${d}"></path>` +
    pts.map(p => `<circle class="c-star" cx="${p[0]}" cy="${p[1]}" r="3.2"></circle>`).join('');
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
initStarfield();
initMoonDial();
initConstellation();

runOverture().then(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });

let resizeT;
window.addEventListener('resize', () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 200);
});
