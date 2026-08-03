// ============================================================
// KARINE S. MATTHEWS — SINGLE SOURCE OF TRUTH
// Psychic Medium · Reiki Healer · Mindset Coach · Gilston, QLD
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
    eyebrow: "Psychic Medium · Reiki Healer · Mindset Coach",
    // Line 2 renders as the gold-foil serif emotional accent (the <em> is clipped-gradient).
    headlineLines: [
      "Welcome, Beautiful Souls.",
      "Come home to your <em>truth</em>."
    ],
    sub: "Reconnect with your truth, release what feels heavy, and find clarity, peace and direction. Every reading and healing is guided by intuition and Spirit, and held with deep compassion. In person in Gilston, or online anywhere in the world.",
    primaryCta: { label: "Book a session", href: "#book" },        // scrolls to the booking builder
    secondaryCta: { label: "Text Karine", intent: "sms" },         // resolves to the booking SMS link at render
    // Honest, above-the-fold reassurances (rendered as small starred cues under the CTAs).
    // All TRUE: online is offered, "never rushed" echoes a real client's words, reply time mirrors booking.responseTimeLabel.
    trust: [
      "In person in Gilston + online worldwide",
      "Warm, private and never rushed",
      "I reply personally, usually within a day"
    ],
    // Cinematic hero: Karine's real pendulum-over-crystals footage, graded dark,
    // with the celestial aura + starfield layered on top. Reduced-motion → poster still.
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
  videoFeature: {
    eyebrow: "Inside the space",
    emotional: "This is where we sit together. <em>Come as you are.</em>",
    video: "assets/space/pendulum.mp4",
    poster: "assets/space/pendulum-poster.jpg",
    caption: "In person in Gilston, or online from anywhere in the world."
  },

  services: [
    {
      id: "readings",
      name: "Intuitive Psychic & Mediumship Readings",
      modality: "In person in Gilston, or online via FaceTime, WhatsApp or Zoom",
      blurb: "Come away with clarity, direction and the comfort of a message meant for you. Each reading blends psychic insight, mediumship, tarot and pendulum work to bring through guidance for your path. Arrive with a question, or simply open to what Spirit wants you to hear.",
      options: [
        { label: "30 minutes", price: 90 },
        { label: "60 minutes", price: 150 }
      ],
      cta: { label: "Book a reading", intro: "I'd like to book a reading." }
    },
    {
      id: "reiki",
      name: "Intuitive Reiki Healing",
      modality: "In person in Gilston only",
      blurb: "Leave lighter, calmer and back home in your body. Gentle, intuitive energy healing that clears blockages, settles the nervous system and rebalances your chakras. You rest, fully clothed, while grounding energy is drawn to where you need it most.",
      options: [
        { label: "60 minutes", price: 110 }
      ],
      supportsRef: "reiki-supports",     // links to the "what Reiki may support" section
      cta: { label: "Book Reiki healing", intro: "I'd like to book a Reiki healing session." }
    },
    {
      id: "coaching",
      name: "Mindset Coaching",
      modality: "In person or online. Enquire for details.",
      blurb: "Reconnect with your worth and move toward the life your soul is calling you into. Compassionate, intuition-led coaching to help you shift limiting patterns and take your next step with clarity. Every session is shaped around you.",
      options: [],                        // no invented price
      enquireOnly: true,
      cta: { label: "Enquire about coaching", intro: "I'd like to enquire about mindset coaching." }
    }
  ],

  reikiSupports: {
    eyebrow: "How Reiki may support you",
    emotional: "Healing is not forcing. <em>It is remembering how to soften.</em>",
    note: "Reiki is a complement to, not a replacement for, medical care.",
    items: [
      "Stress and anxiety",
      "Emotional healing",
      "Mental overwhelm",
      "Sleep disturbances",
      "Recovery from illness or injury",
      "Energetic balance",
      "Relaxation and wellbeing"
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
      { id: "online",   glyph: "globe", title: "Online, worldwide",  body: "Readings and mindset coaching over FaceTime, WhatsApp or Zoom. The connection through Spirit is not limited by distance." }
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
    headline: "Words from souls I have sat with.",
    sub: "In their own words, shared with permission and kept anonymous for privacy.",
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
    role: "Psychic Medium · Reiki Healer · Mindset Coach",
    photo: "assets/about/karine.jpg",                // REAL portrait supplied
    bio: "I am Karine, and my work is guided by intuition and Spirit. For as long as I can remember I have felt energy and heard what sits beneath the surface. Now, from my sacred room in Gilston, I hold space for others to release what is heavy, reconnect with their truth, and find clarity, peace and direction. Every soul who comes to me is met with compassion, grounding energy and divine guidance.",  // CONFIRM / polish with Karine
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
      { glyph: "cards",  title: "Daily collective readings", body: "Tune in for the day's message across TikTok and Instagram." },
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
      a: "Yes. Readings and mindset coaching are available online worldwide via FaceTime, WhatsApp or Zoom. Reiki healing is in person only, in Gilston."
    },
    {
      q: "What happens in a reading?",
      a: "I blend psychic insight, mediumship, tarot and pendulum work to bring through guidance and messages for your path. You are welcome to bring a question, or simply stay open to what Spirit wants you to hear."
    },
    {
      q: "What is Reiki like?",
      a: "You rest, fully clothed, while I channel gentle energy to where your body needs it. Many people feel deeply relaxed, lighter and more balanced afterwards. Reiki is a complement to, not a replacement for, medical care."
    },
    {
      q: "How much do sessions cost?",
      a: "Readings are 90 dollars for 30 minutes or 150 dollars for 60 minutes. Reiki healing is 110 dollars for 60 minutes. Mindset coaching is shaped around you, so please enquire."
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
    body: "I keep my bookings intimate and unhurried, so each soul has my full presence. If something in you feels ready, reach out today and we will find a time that feels right. In person in Gilston, or online from wherever you are."
  },

  booking: {
    mode: "sms",                                     // SMS-first (mirrors Goldy)
    smsHref: "sms:+61404098706",                     // CONFIRM — all booking CTAs resolve here + a pre-filled ?&body=
    phone: "0404 098 706",
    phoneHref: "tel:+61404098706",
    email: "hello@karinematthews.com.au",            // CONFIRM — desktop / shop fallback
    responseTimeLabel: "I reply personally, usually within a day."
  },

  // Base LocalBusiness node. renderSchema() assembles this + a Person node +
  // Service nodes (from services[]) + an FAQPage (from faq[]) into a @graph.
  schema: {
    "@type": ["ProfessionalService", "HealthAndBeautyBusiness"],
    name: "Karine S. Matthews",
    description: "Psychic medium, Reiki healer and mindset coach in Gilston, Gold Coast Hinterland. Intuitive readings, energy healing and coaching, in person and online worldwide.",
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
