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

export const content = Object.freeze({

  brand: {
    name: "Karine S. Matthews",
    wordmark: "KARINE",                              // or "KSM" / a butterfly glyph — CONFIRM
    tagline: "Where your energy, intuition, and soul come home.",
    phone: "0404 098 706",
    phoneHref: "tel:+61404098706",
    email: "hello@karinematthews.com.au",            // CONFIRM
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
    // Karine's own, proven questions (verbatim from her banner) — the longing that brings people to her.
    questions: [
      "Ever curious about what the future holds?",
      "Wish to connect with a loved one who has passed on?",
      "Seeking guidance for what tomorrow brings?"
    ],
    emotional: "Whatever drew you here today, <em>you are in the right place.</em>",
    body: "My sessions are a gentle, sacred space to set down what feels heavy, hear what your soul is whispering, and step forward with clarity and peace. Whether you sit with me in Gilston or we connect online from anywhere in the world, you are held with care from your very first message."
  },

  // Full-bleed cinematic band: Karine's own pendulum swinging over her tarot table.
  services: [
    {
      id: "readings",
      // ⭐ KARINE'S OWN COPY, verbatim from her final text on 2026-08-04. Do not reword.
      name: "Intuitive Psychic Mediumship Readings",
      tagline: "Reconnect with Clarity, Guidance & Spirit.",
      modality: "In person in Gilston, or online via FaceTime, WhatsApp or Zoom",
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
  mindsetCoaching: {
    eyebrow: "Included when you need it",
    title: "Mindset Coaching",
    emotional: "Not a separate session. <em>A part of yours, when Spirit guides it.</em>",
    blurb: "Mindset coaching is naturally woven into my sessions whenever Spirit guides me to, and when I feel it's needed to support your journey. Sometimes the messages you receive are not only about gaining clarity, but also about creating lasting change by recognising limiting beliefs, shifting old patterns, and seeing things from a new perspective.\n\nAt times, I may give you simple exercises, reflections, or practical tasks to complete between sessions. These are designed to help you strengthen your mindset, work through the challenges you're experiencing, and gently move forward with greater confidence, self-awareness, and empowerment.\n\nYou'll walk away with practical tools, a fresh perspective, and the confidence to create positive, lasting change in your life."
  },

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
    steps: [
      { step: "01", title: "Reach out",   body: "Send a text with the session you feel drawn to. I will reply with times and answer anything you are unsure about." },
      { step: "02", title: "We tune in",  body: "Before we begin I ground and connect, so the space is calm, protected and ready to receive whatever Spirit brings." },
      { step: "03", title: "Your session", body: "In person in Gilston or online, we move gently, at your pace, guided by intuition and divine guidance." },
      { step: "04", title: "Integration", body: "You leave with clarity, grounding practices and space to let the energy settle. Follow-up guidance is always welcome." }
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
      { id: "rose-quartz",      name: "Rose Quartz",      price: 30, material: "Rose quartz",                   image: "assets/pendulums/rose-quartz.jpg",     alt: "Rose quartz crystal-point pendulum", blurb: "The stone of the heart. Soft, loving energy for compassion and self-worth." },
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
    note: "A glimpse of the sacred space where in-person sessions are held, in the Gold Coast Hinterland.",
    items: [
      { src: "assets/space/01-table.jpg",        alt: "Karine's reading table with crystal spheres, tarot cards and tumbled stones", category: "space" },
      { src: "assets/space/02-tarot-spread.jpg", alt: "A tarot spread laid out on velvet, the Ten of Cups at the centre",             category: "tools" },
      { src: "assets/space/04-reiki-table.jpg",  alt: "The Reiki healing table set with a line of chakra stones",                     category: "space" },
      { src: "assets/space/06-crystal-ball.jpg", alt: "Clear quartz sphere, sage and crystals on the altar",                          category: "tools" },
      { src: "assets/space/03-tarot-cards.jpg",  alt: "The Lovers, Nine of Pentacles and The High Priestess drawn from the deck",     category: "tools" },
      { src: "assets/space/07-room.jpg",         alt: "Karine's sacred reading room in Gilston",                                      category: "space" }
    ],
    categories: [
      { id: "space", label: "The room" },
      { id: "tools", label: "Sacred tools" }
    ]
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
    // Real client reflections (shared by Karine). Names kept anonymous for privacy;
    // add first names with permission, and pull in more from her Facebook page.
    items: [
      { quote: "From the moment I arrived, I felt completely welcomed and comfortable. She really listened, never rushed, and went into so much detail. There were things she picked up that were incredibly accurate. The reading gave me clarity, reassurance and confidence in the direction I'm heading. I left feeling lighter, more grounded and with a renewed sense of purpose.", name: "A recent client", service: "Psychic & mediumship reading" },
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

  socials: [   // CONFIRM real URLs / handles
    { id: "instagram", label: "Instagram", handle: "@karine",            url: "https://instagram.com/CONFIRM" },
    { id: "facebook",  label: "Facebook",  handle: "Karine S. Matthews", url: "https://facebook.com/CONFIRM" },
    { id: "tiktok",    label: "TikTok",    handle: "@karine",            url: "https://tiktok.com/@CONFIRM" }
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
    }
    // Cancellation / rescheduling policy and gift vouchers — CONFIRM and add.
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
    email: "hello@karinematthews.com.au",            // CONFIRM — desktop / shop fallback
    responseTimeLabel: "I reply personally, usually within a day.",

    // Karine asked (2026-08-04) that prices read like "$90 AUD".
    // The "$" already comes from currencyAU() in script.js; this is the currency
    // label appended after the amount. Numeric prices are unchanged.
    priceSuffix: "AUD",

    // ⭐ Karine's booking requirements, from her review on 2026-08-04.
    // These are her instructions - do not simplify them away.
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    dayParts: ["Morning", "Afternoon", "Evening"],
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
    email: "hello@karinematthews.com.au",                            // CONFIRM
    address: {                                                       // locality only — honest for a home practice
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
});
