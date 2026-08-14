// ============================================================
// KARINE S. MATTHEWS — SINGLE SOURCE OF TRUTH
// Psychic Medium · Reiki Healer · Gilston, QLD
// ------------------------------------------------------------
// Rename / re-price / re-wire the whole site from this file.
// Booking is SMS-first (mirrors the Goldy booking.mode:"sms" pattern):
// every Book / Text / Order button resolves to a pre-filled sms: message.
// Emotional lines are wrapped in <em> and rendered as gold-foil serif.
// Australian English, no em-dashes in prose.
// Every `CONFIRM` needs Karine's real value before go-live.
// ============================================================

import { overrides } from './content.client.js';

// Deep merge: objects merge key by key, everything else (including arrays) replaces
// wholesale. An override key that is not present keeps the base value by construction.
function deepMerge(base, patch) {
  if (patch === undefined) return base;
  if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) return patch;
  const out = Object.assign({}, base);
  for (const key of Object.keys(patch)) {
    const b = out[key];
    out[key] = (b && typeof b === 'object' && !Array.isArray(b))
      ? deepMerge(b, patch[key])
      : patch[key];
  }
  return out;
}

const base = {

  brand: {
    name: "Karine S. Matthews",
    wordmark: "KARINE",                              // or "KSM" / a butterfly glyph — CONFIRM
    tagline: "Where your energy, intuition, and soul come home.",
    phone: "0404 098 706",
    phoneHref: "tel:+61404098706",
    // ⭐ Email removed at Karine's request (2026-08-10): "Remove email sections".
    // The site is SMS-first and the old address was a dead placeholder.
    // Do not re-add an email channel without a real, monitored mailbox from her.
    region: "Gilston, Gold Coast Hinterland, QLD",
    servesInPerson: "Gilston, Gold Coast Hinterland",
    servesOnline: "Online worldwide",
    abn: "",                                         // CONFIRM (if registered)
    domain: "karinematthews.com.au"                  // CONFIRM
  },

  hero: {
    // ⭐ KARINE'S OWN WORDING, taken verbatim from the reference banner she sent
    // on 2026-08-04. Do not reword any of these four lines without asking her.
    kicker: "Welcome to",                                            // small gold italic, sits above the name
    // Line 2 renders as the gold-foil serif emotional accent (the <em> is clipped-gradient).
    headlineLines: [
      "Reconnect with",
      "<em>Karine S. Matthews</em>"
    ],
    // The four pillars from her banner, rendered as gold-separated small caps.
    tagline: ["Psychic Medium", "Intuitive Guidance", "Spiritual Healing", "Clarity"],
    sub: "Guiding you toward clarity, healing, and connection.",
    primaryCta: { label: "Book a session", href: "#book" },        // scrolls to the booking builder
    secondaryCta: { label: "Text Karine", intent: "sms" },         // resolves to the booking SMS link at render
    // Honest, above-the-fold reassurances (rendered as small starred cues under the CTAs).
    // All TRUE: online is offered, "never rushed" echoes a real client's words, reply time mirrors booking.responseTimeLabel.
    trust: [
      "In person in Gilston + online worldwide",
      "Warm, private and never rushed",
      "I reply personally, usually within a day"
    ],
    // Cinematic hero: Karine's REAL clear-crystal chamber pendulum (source photo
    // IMG_2436, rotated upright so it hangs true - the product itself is untouched),
    // relit into a golden-hour beach and given a gentle swing. Seamless ping-pong
    // loop baked into the file, since the player just sets loop=true.
    // Reduced-motion → poster still.
    video: "assets/hero/hero.mp4",
    poster: "assets/hero/hero-poster.jpg"
  },

  intro: {
    eyebrow: "Why you're here",
    lead: "Welcome, Beautiful Souls.",
    // ⭐ KARINE'S OWN "WHY YOU'RE HERE" COPY, verbatim (2026-08-10). This
    // REPLACES the shorter banner questions used until now — her three
    // questions are full sentences and the two closing paragraphs are new.
    // Do not reword, shorten or Americanise any of it.
    questions: [
      "Have you ever wondered what the future may hold?",
      "Longing to reconnect with a loved one in spirit?",
      "Searching for clarity, guidance, or reassurance for the path ahead?"
    ],
    // Her fourth line, split at her own comma to carry the existing gold-foil
    // <em> accent. The words are hers; only the <em> placement is ours.
    emotional: "Whatever has brought you here today, <em>you are exactly where you're meant to be.</em>",
    // Two paragraphs — rendered through paras() so her break survives.
    body: "My sessions offer a gentle, sacred space where you can lay down what feels heavy, reconnect with your inner truth, and receive the guidance your soul is ready to hear.\n\nWhether we meet in person in Gilston or connect online from anywhere in the world, you'll be held with compassion, honesty, and care from the very first message."
  },

  // Full-bleed cinematic band: Karine's own pendulum swinging over her tarot table.
  services: [
    {
      id: "readings",
      // ⭐ KARINE'S OWN COPY, verbatim from her final text on 2026-08-04. Do not reword.
      name: "Intuitive Psychic Mediumship Readings",
      tagline: "Reconnect with Clarity, Guidance & Spirit.",
      modality: "In person in Gilston, or online via FaceTime, WhatsApp or Zoom",
      // Her own photo of the tarot spread on the reading table. Sits at the head
      // of the card so the sessions section is not a wall of text (2026-08-10).
      image: "assets/space/02-tarot-spread.jpg",
      imageAlt: "A tarot spread laid out on velvet on Karine's reading table",
      blurb: "Every reading is a heart-centred, intuitive experience designed to bring you clarity, guidance, and healing. Blending psychic intuition, mediumship, tarot, and the pendulum, I connect with your energy and Spirit to share the messages you most need to hear at this point in your journey. Whether you're seeking answers, reassurance, or direction, you'll receive honest guidance delivered with compassion and care.\n\nYou'll walk away feeling more empowered, with greater clarity, renewed confidence, a sense of peace, and a deeper understanding of the path ahead.",
      options: [
        { label: "30 minutes", price: 90 },
        { label: "60 minutes", price: 150 }
      ],
      cta: { label: "Book a reading", intro: "I'd like to book a reading." }
    },
    {
      id: "reiki",
      name: "Intuitive Reiki Healings",
      modality: "In person in Gilston only",
      image: "assets/space/04-reiki-table.jpg",
      imageAlt: "Karine's Reiki healing table set with a line of chakra stones",
      blurb: "My intuitive Reiki healing sessions are a gentle yet powerful way to restore balance to your mind, body, and spirit. Working with your energy and guided by intuition, I help clear energetic blockages, promote deep relaxation, and support your body's natural healing process.\n\nYou'll walk away feeling lighter, calmer, more balanced, energetically refreshed, and deeply reconnected to yourself.",
      options: [
        { label: "60 minutes", price: 110 }
      ],
      supportsRef: "reiki-supports",     // links to the "what Reiki may support" section
      cta: { label: "Book Reiki healing", intro: "I'd like to book a Reiki healing session." }
    },
  ],

  // ⭐ Mindset coaching is a BONUS woven into a session when it is needed —
  // NOT a separate service and NOT separately bookable. Karine was explicit
  // (2026-08-04). Her copy, verbatim.
  // Things INCLUDED in a session rather than sold separately. Rendered as
  // inclusion panels under the services grid, never as bookable service cards.
  // Add another object here and it renders itself — no code change needed.
  inclusions: [
    {
      id: "mindset",
      eyebrow: "Included when you need it",
      title: "Mindset Coaching",
      emotional: "Not a separate session. <em>A part of yours, when Spirit guides it.</em>",
      // Three paragraphs. Folded behind a real disclosure button so the page
      // reads light (Nicholas, 2026-08-10). Nothing is truncated or reworded;
      // the whole thing is one tap away, and open + static under reduced motion.
      collapsible: true,
      blurb: "Mindset coaching is naturally woven into my sessions whenever Spirit guides me to, and when I feel it's needed to support your journey. Sometimes the messages you receive are not only about gaining clarity, but also about creating lasting change by recognising limiting beliefs, shifting old patterns, and seeing things from a new perspective.\n\nAt times, I may give you simple exercises, reflections, or practical tasks to complete between sessions. These are designed to help you strengthen your mindset, work through the challenges you're experiencing, and gently move forward with greater confidence, self-awareness, and empowerment.\n\nYou'll walk away with practical tools, a fresh perspective, and the confidence to create positive, lasting change in your life."
    },
    {
      // ⭐ KARINE'S REVISED SAGE COPY, verbatim (2026-08-10). This SUPERSEDES
      // the "Sage Clearing" text applied on 2026-08-05 — she retitled it
      // "Guided Sage Cleansing" and rewrote the body.
      // The eyebrow and the emotional foil line are OURS, not hers — confirm.
      // Both were rewritten too: the old ones implied sage happens before
      // every session, which her new copy explicitly says it does not.
      id: "sage",
      eyebrow: "When Spirit guides it",
      title: "Guided Sage Cleansing",
      emotional: "Never in every session. <em>Only when it will carry you.</em>",
      // One short paragraph, so it stays open. Her REAL sage clip rides
      // alongside it instead of a still (it replaced assets/space/05-crystals.jpg,
      // which showed the same bowl on the same altar).
      // 540x784, 7.17s, 24fps, silent, 596KB. The ping-pong loop is baked into
      // the file — the player only ever sets loop = true, so do NOT re-encode it.
      // ⚠️ Honest phone footage with real weaknesses (magenta runner, thin smoke,
      // domestic background). It was judged shippable ONLY as a small, quiet
      // supporting tile: keep it ~280px wide, never full-bleed, never a section
      // background. Reduced motion renders the poster as a still.
      video: "assets/sage/sage.mp4",
      poster: "assets/sage/sage-poster.jpg",
      videoAlt: "Sage smouldering in a bowl of crystals beside a rose quartz sphere on Karine's altar",
      blurb: "At times, I may be guided by Spirit to use sage during your reading or Reiki session. Sage has long been used as a gentle cleansing tool to help clear heavy or stagnant energy, creating a calm and peaceful space for healing, clarity, and connection. It is never used in every session, only when I intuitively feel it will support your journey."
    }
  ],

  reikiSupports: {
    eyebrow: "Reiki may help to",
    emotional: "Healing is not forcing. <em>It is remembering how to soften.</em>",
    // Regulatory requirement — do NOT remove or soften this line.
    note: "Reiki is a complement to, not a replacement for, medical care.",
    // ⭐ KARINE'S OWN LIST, verbatim and in her order (2026-08-04).
    items: [
      "Reduce stress and encourage deep relaxation",
      "Support emotional healing and inner calm",
      "Restore balance to your mind, body, and spirit",
      "Clear energetic blockages",
      "Rebalance and align your chakras",
      "Promote a greater sense of clarity, grounding, and wellbeing"
    ]
  },

  journey: {
    eyebrow: "The session journey",
    emotional: "From the first message to the last breath, <em>you are held.</em>",
    // ⭐ KARINE'S OWN "HOW IT WORKS" COPY, verbatim (2026-08-05). Do not reword.
    // She added a 5th step (Pre-Appointment) covering the full name + fresh selfie.
    // Her lowercase "spirit" here is hers as written — check before capitalising.
    steps: [
      { step: "01", title: "Reach Out",       body: "Send me a message with the session you feel most drawn to. I'll get back to you with my available appointment times and happily answer any questions you may have before booking." },
      { step: "02", title: "Pre-Appointment", body: "Once we've confirmed your booking, I'll ask you to send me your full name and a fresh selfie photo of yourself so I can tune into your energy and sense what spirit may wish to reveal before your session." },
      { step: "03", title: "We Tune In",      body: "Before we begin, I take a moment to ground myself and connect. This creates a calm, protected space that is open and ready to receive whatever spirit wishes to bring through." },
      { step: "04", title: "Your Session",    body: "In person in Gilston or online, we move gently and at your pace, guided by intuition and divine guidance." },
      { step: "05", title: "Integration",     body: "You leave with clarity, grounding practices, and space to let everything settle. Follow-up guidance is always welcome." }
    ],
    modes: [
      { id: "inperson", glyph: "home",  title: "In person, Gilston", body: "A quiet, sacred room in the Gold Coast Hinterland. Readings, Reiki and coaching. Reiki healing is in person only." },
      // Mindset coaching deliberately NOT listed as an online option — Karine asked (2026-08-04).
      { id: "online",   glyph: "globe", title: "Online, worldwide",  body: "Readings over FaceTime, WhatsApp or Zoom. The connection through Spirit is not limited by distance." }
    ]
  },

  // ONE section on the page. Renders ONLY when real products exist (renderer hides it while empty).
  // Each product buy button = checkoutUrl if set (Shopify cart permalink), else a pre-filled SMS order.
  shop: {
    eyebrow: "The pendulum shop",
    emotional: "Every pendulum is chosen with intention. <em>One will feel like yours.</em>",
    note: "Each pendulum is chosen by hand for dowsing, meditation and energy work, and is $30. Message to check what is in stock and to order.",
    // Photos are REAL (Karine's own pendulums). All $30 (Karine confirmed 2026-07-17).
    // Stone names still worth a final check. Add a `checkoutUrl` (Shopify cart permalink)
    // per item later to switch that item to card checkout.
    products: [
      { id: "amethyst",         name: "Amethyst",         price: 30, material: "Natural amethyst, copper coil", image: "assets/pendulums/amethyst.jpg",        alt: "Amethyst crystal-point pendulum with a copper coil", blurb: "Calming and intuitive. A gentle companion for meditation, dowsing and turning inward." },
      // ⚠️ Was listed as "Rose Quartz" until 2026-08-05. The photo is a warm
      // golden-peach cone, not pink — identified as yellow aventurine. The
      // NAME is corrected; this BLURB is ours, not Karine's, so she should
      // confirm both the stone and the wording before launch.
      { id: "yellow-aventurine", name: "Yellow Aventurine", price: 30, material: "Yellow aventurine",           image: "assets/pendulums/yellow-aventurine.jpg", alt: "Yellow aventurine crystal-point pendulum", blurb: "Steadying and confident. For self-belief, clear decisions and standing in your own quiet power." },
      { id: "citrine",          name: "Citrine",          price: 30, material: "Golden citrine, copper coil",   image: "assets/pendulums/citrine.jpg",         alt: "Golden citrine crystal-point pendulum", blurb: "Warm and uplifting. Carries light, optimism and a sense of abundance." },
      { id: "tiger-eye",        name: "Tiger's Eye",      price: 30, material: "Tiger's eye, copper coil",      image: "assets/pendulums/tiger-eye.jpg",       alt: "Tiger's eye crystal-point pendulum", blurb: "Grounding and protective. For courage, focus and steady confidence." },
      { id: "red-jasper",       name: "Red Jasper",       price: 30, material: "Red jasper, copper coil",       image: "assets/pendulums/red-jasper.jpg",      alt: "Red jasper crystal-point pendulum", blurb: "Earthy and stabilising. A grounding stone for strength and quiet endurance." },
      { id: "green-aventurine", name: "Green Aventurine", price: 30, material: "Green aventurine, copper coil",  image: "assets/pendulums/green-aventurine.jpg",alt: "Green aventurine crystal-point pendulum", blurb: "The heart of growth and luck. Gentle renewal, hope and new beginnings." },
      { id: "sodalite",         name: "Sodalite",         price: 30, material: "Sodalite, copper coil",         image: "assets/pendulums/sodalite.jpg",        alt: "Blue sodalite crystal-point pendulum", blurb: "Calm and clear-minded. Supports intuition, truth and honest communication." },
      { id: "lapis-lazuli",     name: "Lapis Lazuli",     price: 30, material: "Lapis lazuli, copper coil",     image: "assets/pendulums/lapis.jpg",           alt: "Lapis lazuli crystal-point pendulum", blurb: "The stone of inner wisdom. Deepens insight and connection to Spirit." },
      { id: "blue-goldstone",   name: "Blue Goldstone",   price: 30, material: "Blue goldstone, copper coil",   image: "assets/pendulums/blue-goldstone.jpg",  alt: "Blue goldstone pendulum sparkling like a night sky", blurb: "A little galaxy in your hand. Uplifting energy under a starry shimmer." },
      { id: "silver-chamber",   name: "Silver Chamber",   price: 30, material: "Silver-tone filigree chamber",  image: "assets/pendulums/silver-chamber.jpg",  alt: "Silver filigree chamber dowsing pendulum", blurb: "A classic openwork dowsing pendulum. Timeless, light and responsive." }
    ]
  },

  // REAL photos only (her healing room, the Gilston hinterland, crystals, candles).
  // Renders ONLY when items exist.
  gallery: {
    eyebrow: "The space",
    emotional: "A room that holds you. <em>Step in and exhale.</em>",
    note: "A glimpse of the sacred space where in-person sessions are held in the Gold Coast Hinterland, and the same purple velvet and crystals she carries wherever she reads.",
    // ⭐ 2026-08-10 — the photos were DELIBERATELY thinned here, not lost.
    // Four of the seven now live further up the page (readings card, Reiki card,
    // the sage panel and the psychic-parties panel) so the writing is broken up
    // by her real imagery instead of arriving as one block of tiles at the end.
    // The tiles below render UNCROPPED (masonry columns, natural height) — the
    // old fixed 240px row plus object-fit:cover was cutting her portrait shots
    // in half on a laptop.
    // ⚠️ 2026-08-13 — this section is HER GILSTON ROOM ONLY. All four of her new
    // expo photos live in the Psychic Expos panel instead. One of them briefly
    // sat here and Nicholas moved it out, correctly: those photos are venues she
    // travels to, not the room she reads in, so filing them under "The space"
    // implied a place they are not. If a future photo is not demonstrably her
    // Gilston room, it does not belong in this array.
    items: [
      { src: "assets/space/01-table.jpg",        alt: "Karine's reading table with crystal spheres, tarot cards and tumbled stones", category: "space" },
      { src: "assets/space/06-crystal-ball.jpg", alt: "Clear quartz sphere, sage and crystals on the altar",                          category: "tools" },
      // 03-banner-and-tables.webp was pulled on 2026-08-13. At render width its
      // chalkboard was legible and read "Pouchic Reading · 15min $35 · 30min $70":
      // a misspelling of her own profession on her own signage, plus prices that
      // contradict both this site and the board in 01. Do not reinstate it unless
      // she reshoots the board. The other three expo photos are clean.
      { src: "assets/space/07-room.jpg",         alt: "Karine's sacred reading room in Gilston",                                      category: "space" }
    ],
    categories: [
      { id: "space", label: "The room" },
      { id: "tools", label: "Sacred tools" }
    ]
  },

  // ⭐ GATHERINGS — the two ways to meet Karine outside a private one-to-one
  // session: her Psychic Parties and the psychic expos she reads at.
  // Both are NEW on 2026-08-10 at her request ("it is not mentioned anywhere
  // and needs to be"). Neither is priced or separately bookable yet, so both
  // resolve to an enquiry text, exactly like the pendulum shop does.
  // The section hides itself if `items` is ever emptied (honest empty state).
  // The eyebrow, the emotional foil line, the "Psychic Expos" panel title and
  // the CTA wording are OURS, not hers — confirm with her.
  gatherings: {
    eyebrow: "Groups & gatherings",
    emotional: "Gather your people. <em>Let the guidance find them too.</em>",
    items: [
      {
        id: "parties",
        // ⭐ KARINE'S OWN PSYCHIC PARTIES COPY, verbatim (2026-08-10). Do not reword.
        eyebrow: "For your next gathering",
        title: "Psychic Parties",
        // Five paragraphs — by far the longest single run of copy on the page,
        // so it is folded behind a disclosure button (Nicholas, 2026-08-10).
        // Verbatim and complete inside; open + static under reduced motion.
        collapsible: true,
        image: "assets/space/03-tarot-cards.jpg",
        imageAlt: "The Lovers, Nine of Pentacles and The High Priestess drawn from the deck",
        blurb: "Looking for something a little different for your next gathering? My Psychic Parties are a beautiful, fun, and meaningful way to bring people together, whether you're celebrating a birthday, hens party, girls' night, family gathering, or simply wanting to share a unique experience with friends.\n\nEvery party is tailored to suit your group and what feels right for the occasion. I can offer mini intuitive psychic and mediumship readings, tarot and pendulum guidance, interactive group activities, and fun spiritual games that encourage connection, laughter, and meaningful conversations.\n\nIf your group is curious, I can also introduce everyone to the pendulum, teaching the basics of how to use it and allowing guests to experience it for themselves in a relaxed and supportive way.\n\nWhether your group is looking for heartfelt guidance, light-hearted fun, or a blend of both, I create a warm, welcoming space where everyone feels included. Every gathering is unique, and I work with you beforehand to ensure the experience reflects your group's needs, energy, and vision.\n\nMy goal is for every guest to leave feeling uplifted, connected, and with something meaningful to take away from the experience. ✨"
      },
      {
        id: "expos",
        // ⭐ KARINE'S OWN EXPO COPY, verbatim (2026-08-10). The panel title is ours.
        eyebrow: "Come and say hello",
        title: "Psychic Expos",
        blurb: "Throughout the year, you can also find me at a selection of local psychic expos. They're a wonderful opportunity to meet in person, experience a mini reading, ask questions, and see if my work resonates with you.",
        // ⭐ 2026-08-13 — her own expo photos, the first imagery this panel has
        // ever had. `images[]` (plural) is a DIFFERENT renderer from the single
        // `image` used by the parties panel above: that one crops to a narrow
        // side column, which would have cut Karine out of two portrait shots.
        // These render as a full-width uncropped pair beneath the copy.
        // ⚠️ HONESTY: we do not know which expo either was taken at, so neither
        // carries an event name or a date, and neither alt line repeats the
        // banner's service list (the banner still says "Mindset Coach", which
        // on this site is an included bonus, not a bookable service).
        images: [
          { src: "assets/expo/01-karine-at-table.webp", alt: "Karine seated at her table at a psychic expo, her roll-up banner beside her, with a crystal ball, a chalkboard sign and her business cards on a purple velvet cloth" },
          { src: "assets/expo/02-karine-at-stand.webp", alt: "Karine smiling at her expo stand in a cream jumper, a crystal ball and cards on the purple velvet table in front of her and her roll-up banner standing to the right" },
          // Moved out of the gallery on 2026-08-13 at Nicholas's instruction, and
          // it belongs here on the facts: this is a venue at night, not her
          // Gilston reading room, so filing it under "The space" implied a place
          // it is not. It is the same roll-up banner and travel set-up as the two
          // above.
          { src: "assets/expo/04-evening-setup.webp", alt: "An evening set-up: a purple velvet table with a lit crystal sphere and a pendulum, beside a live-edge timber bench, trailing plants and Karine's roll-up banner" }
        ]
      }
    ],
    // No prices or mechanics have been set for either, so this is an enquiry,
    // never a booking. Do not add a price here without her confirming one.
    cta: { label: "Ask about a psychic party", intro: "I'd love to ask you about a psychic party." }
  },

  // ⭐ GIFT VOUCHERS — new on 2026-08-10. Karine: "a section where they can
  // order a gift voucher". Nicholas: "match the sessions and also a custom
  // amount also show an example of it".
  //
  // ⚠️ HONESTY RULES BAKED IN:
  //  • Every denomination below is one of HER real, confirmed session prices
  //    (30-min reading $90 · 60-min reading $150 · Reiki 60-min $110). No price
  //    has been invented, and there is no "value" or "was/now" framing.
  //  • There is NO payment processing on this site, so ordering is a pre-filled
  //    SMS, exactly like the pendulum shop. Nothing is ever charged here and
  //    there is no fake success state.
  //  • The preview card is a DESIGN MOCK of what she sends, drawn from the
  //    design tokens. It carries no serial number.
  //
  // ⚖️ 2026-08-14 — GIFT CARD LAW. Since 1 Nov 2019 the Australian Consumer Law
  //    (Div 3A of Pt 3-2, inserted by the Treasury Laws Amendment (Gift Cards)
  //    Act 2018) requires most gift cards sold to consumers to stay redeemable
  //    for AT LEAST 3 YEARS, and the expiry must be PROMINENTLY DISPLAYED. If
  //    the validity is written as a period ("3 years") the ISSUE DATE must be
  //    shown too, so the holder can work out the expiry. Strict liability, max
  //    penalty $6,000 for a person other than a body corporate (Karine is a
  //    sole trader). None of the exemptions fit her: her vouchers are not
  //    reloadable, not donated, not discounted, not loyalty or promotional, and
  //    not for a service available only for a limited period.
  //    → `validityYears` below drives BOTH the voucher card and terms.html.
  //      Do not shorten it below 3, and do not remove the dates from the card.
  // ⏭️ CONFIRM with Karine: whether she wants a printable voucher PDF or just a
  //    message she forwards.
  vouchers: {
    eyebrow: "Gift vouchers",
    emotional: "Give someone the answer they have been carrying. <em>A session, when they are ready for it.</em>",
    note: "A gift voucher can be put toward any session with me. Choose the session you'd like to gift, or any amount you like, and text me. I'll confirm the details and send the voucher through to you.",
    // Real session prices only.
    options: [
      { id: "reading-30", label: "30-minute reading",       amount: 90,  detail: "Intuitive psychic mediumship reading" },
      { id: "reading-60", label: "60-minute reading",       amount: 150, detail: "Intuitive psychic mediumship reading" },
      { id: "reiki-60",   label: "60-minute Reiki healing", amount: 110, detail: "Intuitive Reiki healing, in person in Gilston" }
    ],
    custom: {
      id: "custom",
      label: "Another amount",
      detail: "To put toward any session",
      placeholder: "Amount in AUD",
      hint: "Any amount you like. It goes toward whichever session they choose."
    },
    // ⚖️ How long a voucher lasts. The law sets a 3-year FLOOR; this is the
    // number the card, the terms and the shop copy all read from.
    validityYears: 3,
    // Wording that appears ON the example voucher card. The issue date and the
    // expiry are BOTH printed, which is what makes the card compliant.
    preview: {
      kicker: "Gift voucher",
      forLabel: "For",
      forPlaceholder: "Their name",
      fromLabel: "From",
      fromPlaceholder: "Your name",
      issuedLabel: "Issued",
      expiresLabel: "Valid until",
      foot: "Redeemable on any session with Karine S. Matthews · Gilston, or online worldwide"
    },
    cta: { label: "Order this voucher by text" },
    // Shown under the CTA so nobody expects to pay on the page.
    paymentNote: "There is no checkout here. Text me what you'd like and I'll confirm the details and send you my PayID or bank transfer details, the same as a session booking.",
    // ⚖️ The short, human version of the voucher terms. Kept to four lines on
    // purpose: the full version lives in terms.html#vouchers.
    // ⚠️ The refund line must stay exactly this shape. A blanket "no refunds"
    // is itself a breach of the ACL (s18/s29) because the consumer guarantees
    // survive any policy wording, so change of mind is named as the limit AND
    // the ACL is expressly preserved. Do not shorten it to "non-refundable".
    termsHeading: "The fine print, kindly",
    terms: [
      "Your voucher is valid for 3 years from the day it is bought. The issue date and the expiry are both written on it.",
      "It can go toward any session with me, whether that is a reading or a Reiki healing, in person or online.",
      "If the session costs more than the voucher, you simply pay the difference. If it costs less, the rest stays on the voucher until it expires.",
      "Vouchers cannot be swapped for cash or refunded if you change your mind. That does not take away your rights under the Australian Consumer Law."
    ],
    termsLink: { label: "Read the full voucher terms", href: "terms.html#vouchers" }
  },

  testimonials: {
    // ⭐ KARINE'S OWN INTRO, verbatim (2026-08-04).
    headline: "Client Reflections",
    subhead: "Shared from the Heart, in Their Own Words",
    sub: "The reflections below have been generously shared with permission by those I've been blessed to read for and support through intuitive psychic mediumship readings and Reiki healing sessions. To honour their privacy, all testimonials have been kept anonymous.\n\nI am deeply grateful for the trust each person has placed in me and for allowing me to be part of their journey. I hope their experiences offer you a glimpse into the clarity, healing, and connection that is possible.",
    // Factually TRUE proof points, shown until real client quotes exist.
    proofPoints: [
      { metric: "Intuition-led",      label: "every session",  sub: "Guided by Spirit, tarot and pendulum, never a script." },
      { metric: "In person + online", label: "worldwide",      sub: "Sit with Karine in Gilston, or connect from anywhere." },
      { metric: "Reiki attuned",      label: "energy healing", sub: "Gentle, grounding, and always held with compassion." }
    ],
    // ⭐ HER REAL FACEBOOK REVIEWS (2026-08-10), verbatim from her page
    // "Reconnect with Karine S Matthews". The review TEXT is untouched, and no
    // date, rating or star count has been added — she supplied none we can
    // verify on the page itself, so none is claimed.
    //
    // ⚠️ ATTRIBUTION RULE (Nicholas's call, 2026-08-10): these reviewers are
    // real people who wrote on a Facebook page, not on this website. They are
    // published as FIRST NAME + LAST INITIAL only ("Olivia Sutton" → "Olivia S.")
    // so the quote stays honest and attributable without republishing anyone's
    // full name off-platform. Do NOT restore the full surnames.
    // The full names are in `_incoming/BRIEF-2026-08-10.md` if she ever gives
    // explicit per-person permission to use them.
    //
    // ✅ POLICY CONFIRMED (Karine via Nicholas, 2026-08-10). Her `sub` intro says
    // testimonials are kept anonymous, and that is CORRECT AS WRITTEN — her actual
    // policy is "anonymous unless they chose to publish a review themselves". Her
    // copy is not to be changed. What makes the policy legible on the page is the
    // `source` field below:
    //   • `source` set  → a publicly posted review. Named, with a quiet source line.
    //   • `source` absent → private feedback texted to her. Anonymous, no source line.
    // Never put a `source` on an anonymous item, and never publish a named item
    // without one. `service` stays what it has always been: the session type.
    items: [
      { quote: "I've seen Karine twice and I highly recommend! Both readings were incredibly insightful and accurate - she will tell you what you need to hear! Book a reading asap!!", name: "Olivia S.", source: "Publicly shared on her Facebook page" },
      { quote: "Thank you Karine for the two amazing readings I have had from you (the last one luckily enough to be in person!)\n\nI have had many readings over the years from different people and I found Karine to be warm and welcoming and very intuitive she was totally spot on with her information and has an incredible and unique gift, I highly recommend a session with her and I will definitely be back ! Thank you so much lovely ❤️", name: "Sally G.", source: "Publicly shared on her Facebook page" },
      { quote: "Absolutely beautiful reading. It resonated deeply with my own experiences and the connections I have with my loved ones.\n\nKarine provides warmth, compassion and respect. She creates a safe place when seeking spiritual guidance.\n\nThank you for such a caring and heartfelt experience. I highly recommend this to anyone seeking an authentic and uplifting reading. 💗💗", name: "Shontelle A.", source: "Publicly shared on her Facebook page" },
      { quote: "Karine was so accurate and gave me so much clarity with my reading. She is such a lovely soul and has an amazing gift. I can't recommend enough ✨", name: "Sharna S.", source: "Publicly shared on her Facebook page" },
      { quote: "I recently had a reading with Karine and was genuinely impressed by her intuitive abilities. She has a warm, compassionate nature and made me feel comfortable from the very beginning. The insights she shared were incredibly accurate, thoughtful, and delivered with care. Karine has a remarkable gift as a psychic medium, providing guidance and connections that felt meaningful and authentic. Her reading offered clarity, reassurance, and several validations that resonated deeply with me.\nI highly recommend Karine to anyone seeking spiritual guidance, insight, or a connection with loved ones in spirit. Thank you, Karine, for such a positive and uplifting experience. 💜✨", name: "Kel S.", source: "Publicly shared on her Facebook page" },
      { quote: "Karine has a beautiful, calming energy that made me feel so at ease during my reading. She was spot on with so many things that came through during the session. Infact, she spoke about my questions before I even had to speak them out loud. I walked away feeling very positive, seen and cared for. I would recommend Karine to anyone looking for some guidance", name: "Karen P.", source: "Publicly shared on her Facebook page" },
      // ⚠️ HELD BACK, ON PURPOSE. This is the full verbatim Facebook review whose
      // reviewer's name was cut off in Karine's screenshot. renderVoices() skips
      // any item whose `name` contains "CONFIRM", so it is NOT published: we will
      // not invent a name for her, and we will not quietly file a named public
      // review under "A recent client" as if it were anonymous.
      // It replaces the shortened, anonymised paraphrase of this same review that
      // sat here until 2026-08-10 — her own wording supersedes ours.
      // ⏭️ Get the name from her, drop it in, delete this comment.
      { quote: "I had such a beautiful experience and would highly recommend a reading.\n\nFrom the moment I arrived, I felt completely welcomed and comfortable. She took the time to really listen, never made me feel rushed, and went into so much detail throughout the reading.\n\nThere were several things she picked up that were incredibly accurate, including aspects of my health and where I'm currently at in my life, which genuinely surprised me. More than anything, the reading gave me clarity, reassurance, and confidence in the direction I'm heading.\n\nI left feeling lighter, more grounded, and with a renewed sense of purpose. Whether you're looking for guidance, reassurance, or are simply curious, I would absolutely recommend booking a reading. My partner also had a reading and it was his first one, he left with a very open mind and had a lot more clarity. Thank you again for such a thoughtful and meaningful experience. 💗", name: "CONFIRM — name not captured in the screenshot", source: "Publicly shared on her Facebook page" },
      // Reflections she shared privately, kept anonymous at her request.
      { quote: "Thank you so much for today. I was in shock and speechless, just content in knowing that my loved ones came through and that they are around me. It gave me so much more clarity. You are amazing at what you do!", name: "A recent client", service: "Mediumship reading", featured: true },
      { quote: "Thank you so much for such a good reading. You have helped me feel more grounded and have a bit more clarity.", name: "A recent client", service: "Psychic reading" },
      { quote: "I just wanted to say thank you again for your guidance and kindness. I really needed that. You have such an amazing gift.", name: "A recent client", service: "Reading" }
    ]
  },

  about: {
    name: "Karine S. Matthews",
    role: "Psychic Medium · Reiki Healer",
    eyebrow: "The heart behind every session...",
    photo: "assets/about/karine.jpg",                // REAL portrait supplied
    // ⭐ KARINE'S OWN BIO, verbatim and approved by her (2026-08-04). Do not reword.
    bio: "Hello, I'm Karine.\n\nMy work is guided by intuition, Spirit, and a deep passion for helping others reconnect with themselves. For as long as I can remember, I've been able to sense energy and perceive what lies beneath the surface. It is a gift I feel truly honoured to share.\n\nFrom my peaceful sacred space in Gilston on the Gold Coast, I hold a safe, supportive space for people to release what no longer serves them, reconnect with their inner truth, and gain the clarity, healing, and direction they seek.\n\nEvery person who walks through my door is welcomed with compassion, grounded energy, and heartfelt guidance, meeting you exactly where you are on your journey while gently helping you move forward with greater confidence, peace, and purpose.",
    credentials: [],                                 // Reiki level, mediumship training — CONFIRM
    signature: "— Karine 🦋"
  },

  // Karine's requested "coming soon" spots.
  comingSoon: {
    eyebrow: "Coming soon",
    emotional: "New ways to journey with me. <em>Watch this space.</em>",
    items: [
      { glyph: "moon",   title: "Recorded meditations", body: "Gentle guided meditations to ground, protect and reconnect, coming soon to listen to any time." },
      { glyph: "portal", title: "Workshops",            body: "Intimate workshops to develop your own intuition and connection. Dates to be announced." }
    ],
    cta: { label: "Tell me when they're ready", intro: "I'd love to be told when your recorded meditations and workshops are available." }
  },

  sacredContent: {
    eyebrow: "Sacred content",
    emotional: "Come sit under the same moon. <em>The guidance is always flowing.</em>",
    body: "Energy insights, full-moon wisdom, portal updates, spiritual tools and special offers. I share daily collective readings and guidance across my socials. Follow along.",
    cards: [
      { glyph: "moon",   title: "Full-moon wisdom",          body: "Lunar energy insights and rituals as each cycle turns." },
      { glyph: "portal", title: "Portal updates",            body: "Guidance for the energetic gateways as they open." },
      { glyph: "cards",  title: "Daily collective readings", body: "Tune in for the day's message across TikTok, Instagram and Facebook." },
      { glyph: "gift",   title: "Spiritual tools & offers",  body: "Pendulums, practices and gentle offers for your journey." }
    ]
  },

  // ⭐ HER REAL SOCIALS (2026-08-06), each one resolved and confirmed hers.
  // Instagram and TikTok are both @karinesmatthews, matching the domain.
  // ⚠️ FACEBOOK IS DIFFERENT ON PURPOSE — do not "tidy" it to match the others.
  // `facebook.com/karinesmatthews` is her PERSONAL profile (Karine Matthews,
  // 682 friends, "Mum of 4"). Sending clients there takes them away from the
  // business page and its reviews. Her BUSINESS page vanity is
  // `reconnectwithkarinesmatthews`, verified 2026-08-11 to resolve with no
  // redirect to "Karine S Matthews · 4.2K followers · Psychic Medium".
  // Fallback that always works: https://www.facebook.com/profile.php?id=61558266392714
  socials: [
    { id: "instagram", label: "Instagram", handle: "@karinesmatthews",    url: "https://www.instagram.com/karinesmatthews" },
    { id: "facebook",  label: "Facebook",  handle: "@reconnectwithkarinesmatthews", url: "https://www.facebook.com/reconnectwithkarinesmatthews" },
    { id: "tiktok",    label: "TikTok",    handle: "@karinesmatthews",    url: "https://www.tiktok.com/@karinesmatthews" }
  ],

  faq: [
    {
      q: "How do I book a session?",
      a: "The fastest way is to text me. Tap any Book button and it opens a pre-filled message. Tell me the session you would like and I will reply with available times."
    },
    {
      q: "Do you offer sessions online?",
      // Mindset coaching deliberately removed here — Karine asked (2026-08-04).
      a: "Yes. Readings are available online worldwide via FaceTime, WhatsApp or Zoom. Reiki healing is in person only, in Gilston."
    },
    {
      q: "What happens in a reading?",
      a: "I blend psychic insight, mediumship, tarot and pendulum work to bring through guidance and messages for your path. You are welcome to bring a question, or simply stay open to what Spirit wants you to hear."
    },
    {
      q: "Can I come with a friend?",
      a: "I ask that readings are one-on-one only. This helps me create a quiet, private space where I can connect fully with your energy without distractions."
    },
    {
      q: "What is Reiki like?",
      a: "You rest, fully clothed, while I channel gentle energy to where your body needs it. Many people feel deeply relaxed, lighter and more balanced afterwards. Reiki is a complement to, not a replacement for, medical care."
    },
    {
      q: "How much do sessions cost?",
      a: "Readings are $90 AUD for 30 minutes or $150 AUD for 60 minutes. Reiki healing is $110 AUD for 60 minutes. Mindset coaching is included in your session when it is needed, at no extra cost."
    },
    {
      q: "Where are you based?",
      a: "In Gilston, in the Gold Coast Hinterland, Queensland. In-person sessions are held here, and online sessions reach beautiful souls all over the world."
    },
    // ⚖️ 2026-08-14 — the cancellation policy and the voucher validity now
    // exist, so they belong where people actually look for them. Both mirror
    // terms.html word for word in substance. If you change one, change both.
    {
      q: "What if I need to cancel or change my time?",
      a: "Just let me know at least 24 hours before your session and we will find another time, with no fee. If it is less than 24 hours, or if you do not make it at all, a session you have already paid for may not be able to be moved. Life happens though, so please talk to me."
    },
    {
      q: "How long does a gift voucher last?",
      a: "Three years from the day it is bought. The issue date and the expiry are both written on the voucher, so there is never any guessing. It can go toward any session with me."
    }
  ],

  cta: {
    eyebrow: "Ready?",
    emotional: "Your soul has been waiting. <em>Let's begin.</em>",
    // ⭐ KARINE'S OWN CLOSING COPY, verbatim (2026-08-04).
    body: "Every reading and healing session is held with intention, compassion, and presence. I only take a limited number of bookings so each person receives the time and energy they deserve. If you're feeling called to connect, trust that nudge. Reach out today, and we'll find the perfect time for your session. Join me in person in Gilston or online from wherever you are."
  },

  booking: {
    mode: "sms",                                     // SMS-first (mirrors Goldy)
    smsHref: "sms:+61404098706",                     // CONFIRM — all booking CTAs resolve here + a pre-filled ?&body=
    phone: "0404 098 706",
    phoneHref: "tel:+61404098706",
    // ⭐ No email fallback. Karine asked for the email sections to be removed
    // (2026-08-10) and the site is fully bookable by SMS or phone without one.
    responseTimeLabel: "I reply personally, usually within a day.",

    // Karine asked (2026-08-04) that prices read like "$90 AUD".
    // The "$" already comes from currencyAU() in script.js; this is the currency
    // label appended after the amount. Numeric prices are unchanged.
    priceSuffix: "AUD",

    // ⭐ Karine's booking requirements, from her review on 2026-08-04.
    // These are her instructions - do not simplify them away.
    // ⭐ HER REAL TRADING HOURS, from her Facebook page (2026-08-05).
    // Mon 09:30-16:30 · Tue 09:30-17:00 · Wed CLOSED · Thu 09:30-17:00
    // Fri 09:30-17:00 · Sat 13:30-16:00 · Sun 13:30-16:00
    // Nothing runs past 17:00, so there is NO evening column, and Wednesday is
    // omitted entirely. Weekends are afternoon-only. Never offer a slot she
    // does not actually work — she would only have to write back and decline.
    dayParts: ["Morning", "Afternoon"],
    days: [
      { name: "Monday",    parts: ["Morning", "Afternoon"] },
      { name: "Tuesday",   parts: ["Morning", "Afternoon"] },
      { name: "Thursday",  parts: ["Morning", "Afternoon"] },
      { name: "Friday",    parts: ["Morning", "Afternoon"] },
      { name: "Saturday",  parts: ["Afternoon"] },
      { name: "Sunday",    parts: ["Afternoon"] }
    ],
    hoursNote: "These are the times I read. Wednesdays I am closed, and weekends are afternoons only.",
    platforms: ["FaceTime", "WhatsApp", "Zoom"],     // shown only when Online is chosen
    focusPlaceholder: "For example, any particular area of your life you would like me to look at: personal, relationships, work or career.",
    // The SMS app lets you attach a photo before sending, so this is a real
    // instruction, not a promise the site cannot keep.
    selfieNote: "Before you hit send, please attach a recent selfie. I tune into your energy from it and see what Spirit may reveal ahead of your session.",
    payment: {
      heading: "Payment",
      inPerson: "In person: you can pay cash on the day.",
      online: "Online: payment needs to be in my account and cleared before your session starts.",
      // No account numbers on a public page - she sends them on confirmation.
      methods: "I accept PayID or bank transfer, and I will send you my details once we have confirmed your time."
    }
  },

  // ============================================================
  // ⚖️ LEGAL PAGES — privacy.html · terms.html · disclaimer.html
  // ------------------------------------------------------------
  // Rendered by legal.js, which builds the whole page (doc + footer) from
  // this block. Three separate documents, three separate URLs, one <h1> each.
  //
  // WHY THIS EXISTS (verified 2026-08-14, sources in the section comments):
  //  • PRIVACY — the Privacy Act's $3M small-business exemption does NOT reach
  //    a health service provider, and the OAIC names complementary therapists
  //    as an example. Reiki is a complementary therapy, so Karine is very
  //    likely an APP entity and APP 1.3 requires a clearly expressed, current
  //    privacy policy. She also holds sensitive information: a selfie of every
  //    client, plus whatever they tell her about their health and state of mind.
  //  • TERMS — the gift vouchers need the 3-year rule in writing (see the
  //    `vouchers` block above), and the booking, payment and cancellation
  //    arrangements were nowhere on the site.
  //  • DISCLAIMER — no health claims, no outcome promises (ACL s18).
  //
  // ⛔ THREE THINGS THAT MUST NOT BE "TIDIED":
  //  1. NEVER write a blanket "no refunds" anywhere. The Australian Consumer
  //     Law consumer guarantees cannot be excluded, restricted or modified, and
  //     wording that implies otherwise is itself a breach (ACL s18/s29 — the
  //     ACCC enforces this hard). Change of mind may be excluded; the
  //     guarantees may not. Every refund line here names change of mind AND
  //     expressly preserves the ACL. Keep both halves.
  //  2. NO HEALTH CLAIMS. Reiki is never said to treat, cure, heal or relieve
  //     anything. "Reiki is a complement to, not a replacement for, medical
  //     care" is her own line, already on the site, and is reused verbatim.
  //  3. NO INVENTED FACTS. No ABN, no email, no company number, no insurance,
  //     no professional-body membership. `brand.abn` is empty and the business
  //     line hides itself; fill the token in and it appears on all three pages.
  //
  // `{phone}` in any string is replaced with brand.phone at render time, so the
  // number lives in exactly one place.
  legal: {
    // ⏭️ Bump this whenever you change the wording of any document below.
    updated: "14 August 2026",
    updatedLabel: "Last updated",
    backLabel: "Back to the site",
    // Order here drives the footer links and the cross-links between the pages.
    order: ["privacy", "terms", "disclaimer"],
    docs: {

      privacy: {
        slug: "privacy.html",
        navLabel: "Privacy",
        title: "Privacy Policy",
        metaDescription: "How Karine S. Matthews collects, uses and protects your personal information, written to the Australian Privacy Principles.",
        intro: "What you share with me is private. This explains exactly what I collect, why I need it, how long I keep it, and what you can ask me to do with it.",
        sections: [
          {
            h: "Why I have a privacy policy",
            p: [
              "I am a sole trader working from Gilston in the Gold Coast Hinterland. Part of what I offer is Reiki, which counts as a health service under the Privacy Act 1988, so the Australian Privacy Principles apply to my practice no matter how small it is. I am glad they do.",
              "This policy is written plainly, because you should not need a lawyer to understand what happens to your own information."
            ]
          },
          {
            h: "What I collect",
            p: ["Only what I need in order to hold your session."],
            list: [
              "Your name.",
              "Your phone number, because everything with me is arranged by text.",
              "A recent selfie, which I ask you to send before a reading.",
              "Whatever you choose to tell me: the days and times that suit you, what you would like me to look at, your questions, and anything you share in a message or during your session. That can include things about your health, your relationships and how you are feeling.",
              "A postal address, but only if you have ordered a pendulum and need it sent to you."
            ],
            after: ["That is the lot. There is no account to create, and there is no form on my website that quietly sends me anything."]
          },
          {
            h: "Why I collect it",
            p: [
              "To arrange your session and to be able to write back to you. To prepare properly before we meet. To post you a pendulum or send you a gift voucher if you have ordered one. And to keep a simple record of what we agreed.",
              "I do not use your information for advertising, and I will not add you to a mailing list."
            ]
          },
          {
            h: "Your selfie",
            p: [
              "Before a reading I ask for a fresh selfie so I can tune into your energy and sense what Spirit may wish to bring through. Preparing for your session is the only thing it is ever used for.",
              "I delete your photo once your session is finished. It is not filed away, not kept on a computer, not posted anywhere and not shown to anyone."
            ]
          },
          {
            h: "What you tell me stays with me",
            p: [
              "I do not sell your personal information, and I do not share, trade or hand it to anyone else for their own purposes. What is said in a session is not repeated.",
              "The only time I would ever pass something on is if the law required it, or if I genuinely believed someone's life or safety was at risk.",
              "Some of the reviews on my website were written publicly by clients on my Facebook page. Those are shown as a first name and last initial, and each one says where it came from. Anything shared with me privately stays anonymous unless you have told me otherwise."
            ]
          },
          {
            h: "Online sessions",
            p: [
              "Online readings happen over FaceTime, WhatsApp or Zoom. Those services are run by companies based overseas, so your call travels through their systems the way any video call does, and their own privacy terms apply to that part of it.",
              "I do not record sessions unless you ask me to and I have agreed to it."
            ]
          },
          {
            h: "This website",
            p: [
              "My website sets no tracking cookies and there is no analytics watching what you do on it.",
              "There is also nothing on it that sends me anything. Every Book and Order button simply writes a message for you and opens your own phone's messaging app. Nothing reaches me until you have read it and pressed send yourself.",
              "The one thing the site loads from somewhere else is the typeface it is set in, which comes from Google Fonts."
            ]
          },
          {
            h: "How I look after it, and how long I keep it",
            p: [
              "I take reasonable steps to keep what you share with me safe, private and out of anyone else's hands.",
              "Your selfie is deleted after your session. Anything else I keep only for as long as I genuinely need it, and then I get rid of it."
            ]
          },
          {
            h: "Seeing, correcting or deleting your information",
            p: [
              "You can ask me at any time what I hold about you, ask me to correct anything that is wrong, or ask me to delete it altogether. Text or call me on {phone} and I will take care of it, normally within a few days, and it costs you nothing.",
              "If there is ever a reason I cannot do what you have asked, I will tell you what that reason is."
            ]
          },
          {
            h: "If you are not happy",
            p: [
              "Please tell me first. Text or call me on {phone} and I will listen and do my best to put it right. I will respond within 30 days.",
              "If you are still not satisfied, you are entitled to take it further with the Office of the Australian Information Commissioner, which is the national privacy regulator. They can be reached at oaic.gov.au or on 1300 363 992."
            ]
          },
          {
            h: "Getting in touch",
            p: [
              "There is no email address for my practice, by choice. Text or call me on {phone} and it comes straight to me."
            ]
          },
          {
            h: "Changes to this policy",
            p: [
              "If anything here changes I will update this page and change the date at the top of it."
            ]
          }
        ]
      },

      terms: {
        slug: "terms.html",
        navLabel: "Terms",
        title: "Terms",
        metaDescription: "Booking, payment, cancellations, pendulums and gift voucher terms for sessions with Karine S. Matthews.",
        intro: "How booking, paying, cancelling, pendulums and gift vouchers work. Written plainly, because you should be able to read it in a couple of minutes.",
        sections: [
          {
            h: "About these terms",
            p: [
              "These are the everyday terms for booking a session with me, ordering a pendulum, or buying a gift voucher.",
              "Nothing on this page takes away your rights under the Australian Consumer Law. Those rights come with anything you buy in Australia, and they cannot be signed away by you or by me."
            ]
          },
          {
            h: "Booking a session",
            p: [
              "Everything is arranged by text. When you tap a Book button on my website it writes the message for you and opens your own messaging app. Nothing is sent until you press send, and nothing is booked at that moment.",
              "Your session is confirmed once I have written back and we have both agreed on a time."
            ]
          },
          {
            h: "Prices",
            p: [
              "The price of every session is shown on my website in Australian dollars, and that is what you pay. There are no booking fees and no surcharges.",
              "Mindset coaching and Guided Sage Cleansing are included in a session when they are needed, at no extra cost. Neither is sold separately."
            ]
          },
          {
            h: "Paying",
            p: [
              "For a session in person in Gilston, you are welcome to pay cash on the day.",
              "For an online session, payment needs to be in my account and cleared before we begin. I accept PayID or bank transfer, and I send you those details privately once your time is confirmed.",
              "My account details are never published on my website, and I will never ask you for your card numbers by text."
            ]
          },
          {
            id: "cancellations",
            h: "Changing or cancelling a session",
            p: [
              "If you need to cancel or move your session, please give me at least 24 hours notice. There is no fee for that, and we will simply find another time that suits you.",
              "With less than 24 hours notice, or if you do not make it at all, a session you have already paid for may not be able to be moved or refunded. I hold that time just for you and turn other people away for it. Life happens though, so please talk to me.",
              "If I ever have to change your time, I will let you know as soon as I can and we will reschedule, or you can have your money back.",
              "This is a change-of-mind policy and it does not affect your rights under the Australian Consumer Law."
            ]
          },
          {
            id: "pendulums",
            h: "Pendulums",
            p: [
              "Pendulums are $30 each and are ordered by text, the same way a session is booked. There is no checkout on my website.",
              "Every pendulum is natural stone, so the colour, the markings and the shape vary a little from the photo. That is part of the charm of them.",
              "Once payment is confirmed I post yours within Australia. I will confirm the postage with you before you pay anything. If it does not arrive, or it arrives damaged, tell me and I will make it right.",
              "If a pendulum arrives broken, or it is not what I described, you are entitled to a repair, a replacement or a refund under the consumer guarantees. That is your right, not a favour. If you have simply changed your mind, I am not able to refund it, although you are always welcome to ask."
            ]
          },
          {
            id: "vouchers",
            h: "Gift vouchers",
            p: [
              "A gift voucher is valid for 3 years from the day it is bought. Both the issue date and the date it runs out are written on the voucher itself, so nobody has to work it out.",
              "A voucher can go toward any session with me: a reading or a Reiki healing, in person or online. Whoever you give it to has exactly the same rights over it as you do.",
              "If the session chosen costs more than the voucher, the difference is paid on the day. If it costs less, whatever is left stays on the voucher until it expires.",
              "There are no fees of any kind on a voucher. It does not lose value while it waits, and it costs nothing to use.",
              "Vouchers cannot be exchanged for cash, and they are not refundable if you change your mind. That does not limit anyone's rights under the Australian Consumer Law, and that applies to the person who receives the voucher just as much as to the person who bought it.",
              "Please look after it the way you would look after cash. If it goes missing, tell me and I will do what I can to help.",
              "Vouchers are ordered by text and I send yours through once payment is confirmed."
            ]
          },
          {
            h: "Refunds and your consumer rights",
            p: [
              "You are always entitled to the consumer guarantees under the Australian Consumer Law. If something I provide is not delivered with due care and skill, is not fit for the purpose I described, or does not match what I told you, you may be entitled to a refund, a replacement or compensation for a reasonable loss. Nothing on this page changes any of that.",
              "Where I say something is not refundable, I am talking about changing your mind. I am not talking about the guarantees above, because those cannot be excluded by anybody.",
              "If something has gone wrong, please tell me. I would far rather hear about it than not."
            ]
          },
          {
            h: "Sessions are one to one",
            p: [
              "Readings are one-on-one, so that I can connect fully with your energy without distraction. If you would like something for a group, my Psychic Parties are made for exactly that."
            ]
          },
          {
            h: "Guidance, not advice",
            p: [
              "My readings and healings are offered for guidance and personal insight. They are not a substitute for professional advice, and no particular outcome is promised. Please read the disclaimer as well, because it forms part of these terms."
            ]
          },
          {
            h: "If these terms change",
            p: [
              "If anything here changes I will update this page and change the date at the top of it. The terms that apply to your session are the ones on this page at the time you book."
            ]
          },
          {
            h: "Getting in touch",
            p: [
              "Text or call me on {phone}. There is no email address for my practice."
            ]
          }
        ]
      },

      disclaimer: {
        slug: "disclaimer.html",
        navLabel: "Disclaimer",
        title: "Disclaimer",
        metaDescription: "Readings and Reiki with Karine S. Matthews are offered for guidance and personal insight, and are not a substitute for professional advice.",
        intro: "What my work is, and what it is not. Please read this before you book.",
        sections: [
          {
            h: "Guidance, not advice",
            p: [
              "Everything I offer is for guidance, reflection and personal insight. What comes through in a reading is my honest interpretation of what I sense, and it is yours to take or to leave.",
              "You are always the one who decides what to do with it."
            ]
          },
          {
            h: "Not a substitute for professional advice",
            p: [
              "Nothing I offer is a substitute for professional medical, legal, financial or psychological advice, and it is not a replacement for care from a qualified professional.",
              "Please do not start, stop or change any treatment, medication or professional advice because of something said in a session. Speak to your doctor or your adviser.",
              "I do not diagnose, and I do not treat medical or psychological conditions."
            ]
          },
          {
            h: "About Reiki",
            p: [
              // ⭐ Her own line, already live in the FAQ. Reused word for word.
              "Reiki is a complement to, not a replacement for, medical care.",
              "It is a gentle, deeply relaxing practice, and many people simply feel calmer and lighter afterwards. I make no claim that it treats, cures or relieves any illness or condition, and I would never suggest you use it instead of seeing a doctor."
            ]
          },
          {
            h: "No outcome is promised",
            p: [
              "I cannot and do not promise any particular result, outcome or event. No reading can reliably tell you what the future holds, and anyone who tells you otherwise is not being straight with you.",
              "What I can promise is honesty, care, and my full attention for the time we have together.",
              "The future is not fixed, and your choices are your own."
            ]
          },
          {
            h: "Adults only",
            p: [
              "My sessions are for adults aged 18 and over. If you are under 18, please do not book a session with me."
            ]
          },
          {
            h: "If you are struggling",
            p: [
              "A reading is not crisis support. If you are in distress, or you are worried about your safety or someone else's, please reach out to someone who can help right now.",
              "Lifeline is on 13 11 14, at any hour of the day or night. In an emergency, call 000."
            ]
          },
          {
            h: "Your decisions are your own",
            p: [
              "By booking a session you accept that you are responsible for the choices you make, including any decision you make after a reading or a healing. Please use your own judgement, and get professional advice wherever it matters.",
              "None of this limits your rights under the Australian Consumer Law."
            ]
          },
          {
            h: "Getting in touch",
            p: [
              "If anything here is unclear, please ask me before you book. Text or call me on {phone}."
            ]
          }
        ]
      }
    }
  },

  // Base LocalBusiness node. renderSchema() assembles this + a Person node +
  // Service nodes (from services[]) + an FAQPage (from faq[]) into a @graph.
  schema: {
    "@type": ["ProfessionalService", "HealthAndBeautyBusiness"],
    name: "Karine S. Matthews",
    description: "Psychic medium and Reiki healer in Gilston, Gold Coast Hinterland. Intuitive psychic mediumship readings in person and online worldwide, and Reiki healing in person.",
    priceRange: "$$",
    image: "https://karinematthews.com.au/assets/og/og-image.jpg",   // CONFIRM domain
    url: "https://karinematthews.com.au/",                           // CONFIRM domain
    telephone: "+61404098706",                                       // CONFIRM
    // No `email` node — she asked for email to be removed (2026-08-10).
    address: {                                                     // locality only — honest for a home practice
      "@type": "PostalAddress",
      addressLocality: "Gilston",
      addressRegion: "QLD",
      addressCountry: "AU"
    },
    areaServed: [
      { "@type": "Place", name: "Gilston, Gold Coast Hinterland, QLD" },
      { "@type": "Place", name: "Online worldwide" }
    ]
    // sameAs (socials) is assembled from socials[] in renderSchema()
  }
};

export const content = Object.freeze(deepMerge(base, overrides));
