/**
 * ─── STATIC PLACEHOLDER CONTENT ──────────────────────────────────────────────
 * Everything in this file is hardcoded because no API/CMS endpoint exists for
 * it yet (hero banners, curated home sections, events, trending searches).
 * Edit freely, or replace a whole block with a fetch once an endpoint ships.
 * Images use picsum.photos seeds so the layout renders without real assets —
 * swap `img` values for your own URLs (add their host to next.config.ts).
 */

/**
 * Category IDs shown under the home "Services" tab. The API has no
 * business/service flag on main categories (the subcategory `service_type`
 * field is populated on only a handful of rows, so it can't be trusted), so
 * this split is curated by hand from the live getService list. Edit freely;
 * replace with an API field the day one exists. Categories NOT listed here
 * appear under the "Business" tab.
 */
export const serviceCategoryIds: string[] = [
  "98", // Services
  "319", // Emergency services
  "283", // Government Services
  "278", // House Labourers
  "277", // Freelancers
  "291", // Professionals
  "102", // Taxi & Goods
  "304", // Transportation
  "271", // Travel & Tourism
  "293", // Bank & Fin.Services
  "294", // Internet
  "290", // Rental
  "298", // Advertising
  "301", // Care Centre
  "286", // Career
  "309", // Work From Home
  "316", // Astrology
];

export interface CuratedTile {
  label: string;
  img: string;
  /** Search term the tile links to: /listing?term=... */
  term: string;
}

export interface CuratedSection {
  title: string;
  tiles: CuratedTile[];
}

const ph = (seed: string, w = 400, h = 300) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/** The 2×2 curated card grid on Home — Business tab. */
export const curatedBusiness: CuratedSection[] = [
  {
    title: "Everyday beauty & glow",
    tiles: [
      { label: "Beauty Parlour", img: ph("parlour"), term: "beauty parlour" },
      { label: "Salon Spots", img: ph("salon"), term: "salon" },
      { label: "Massage", img: ph("massage"), term: "massage" },
    ],
  },
  {
    title: "Shops, and showrooms",
    tiles: [
      { label: "Bike Showroom", img: ph("bike"), term: "bike showroom" },
      { label: "Mobile Showroom", img: ph("mobile"), term: "mobile" },
      { label: "Laptop Showroom", img: ph("laptop"), term: "laptop" },
    ],
  },
  {
    title: "Fashion jewellery collection",
    tiles: [
      { label: "Cloth Store", img: ph("cloth"), term: "cloth store" },
      { label: "Diamond Store", img: ph("diamond"), term: "jewellery" },
      { label: "Wedding Jewellery Store", img: ph("wedding-jewel"), term: "wedding jewellery" },
    ],
  },
  {
    title: "Entertainment & Events",
    tiles: [
      { label: "Movie", img: ph("movie"), term: "theatre" },
      { label: "Event", img: ph("event"), term: "events" },
      { label: "Theme Parks", img: ph("themepark"), term: "theme park" },
    ],
  },
];

/** The same grid on Home — Services tab. */
export const curatedServices: CuratedSection[] = [
  {
    title: "Everyday beauty & glow",
    tiles: [
      { label: "Web Developer", img: ph("webdev"), term: "web developer" },
      { label: "Video Editor", img: ph("videoedit"), term: "video editor" },
      { label: "Content Writer", img: ph("writer"), term: "content writer" },
    ],
  },
  {
    title: "Shops, and showrooms",
    tiles: [
      { label: "AC Technician", img: ph("actech"), term: "ac repair" },
      { label: "Electrician", img: ph("electrician"), term: "electrician" },
      { label: "Plumber", img: ph("plumber"), term: "plumber" },
    ],
  },
  {
    title: "Fashion jewellery collection",
    tiles: [
      { label: "Delivery Partner", img: ph("delivery"), term: "delivery" },
      { label: "Acting Driver", img: ph("driver"), term: "driver" },
      { label: "House Cleaning Service", img: ph("cleaning"), term: "cleaning" },
    ],
  },
  {
    title: "Entertainment & Events",
    tiles: [
      { label: "Photographer", img: ph("photographer"), term: "photographer" },
      { label: "Makeup Artist", img: ph("makeup"), term: "makeup artist" },
      { label: "Home Baker", img: ph("baker"), term: "bakery" },
    ],
  },
];

export interface EventItem {
  title: string;
  location: string;
  img: string;
}

/** "Latest Events in Your Location" strip — no events API exists yet. */
export const events: EventItem[] = [
  { title: "Business Meet", location: "Gandhipuram, Coimbatore", img: ph("bizmeet", 480, 576) },
  { title: "Dj Party", location: "Tatabad, Coimbatore", img: ph("djparty", 480, 576) },
  { title: "Tech Workshop", location: "Rs Puram, Coimbatore", img: ph("workshop", 480, 576) },
  { title: "Startup Event", location: "Gandhipuram, Coimbatore", img: ph("startup", 480, 576) },
  { title: "Digital Meetup", location: "Gandhipuram, Coimbatore", img: ph("meetup", 480, 576) },
];

/** "Trending Searches" chips — links go to /listing?term=... */
export const trendingSearches: string[] = [
  "Electricians near me",
  "Pest Control Services",
  "Best Restaurants in Mumbai",
  "Movie Tickets",
  "Packers and Movers",
  "AC Repairing",
  "Car Rentals",
  "Tutors for Mathematics",
  "Real Estate Agents",
];

export interface HeroBanner {
  headline: string;
  subline: string;
  note: string;
  img: string;
  bg: string; // tailwind classes for the banner background
}

/** Hero ad banner on Home + listing pages. */
export const heroBanner: HeroBanner = {
  headline: "Up to 40% off",
  subline: "Books for SSC, UPSC & more",
  note: "WIDE SELECTION · GREAT PRICES",
  img: ph("books", 900, 360),
  bg: "bg-emerald-900",
};

export interface MidBanner {
  dates: string;
  title: string;
  highlight: string;
  badge: string;
  finePrint: string;
  img: string;
  bg: string; // tailwind background class for the banner
}

/** Wide ad banner between the hub card and the events section (static — no ads API). */
export const midBanner: MidBanner = {
  dates: "25th – 27th January",
  title: "Home makeover days",
  highlight: "Starting ₹99",
  badge: "FREE DELIVERY ON FIRST ORDER",
  finePrint: "7.5% Instant Discount* on Credit Card EMI Transactions · *T&C Apply",
  img: ph("makeover", 640, 420),
  bg: "bg-[#efe7dc]",
};

export const footerColumns: { title: string; links: string[] }[] = [
  {
    title: "Quick Link",
    links: ["About Us", "Contact Us", "Advertise With Us", "Free Business Listing", "Customer Support", "Careers", "Feedback", "Privacy Policy", "Terms & Conditions"],
  },
  {
    title: "Support",
    links: ["Help Center", "Report an Issue", "FAQs", "Business Verification", "Return & Refund", "Policy"],
  },
  {
    title: "Business",
    links: ["Beauty & Personal Care", "Jewellery & Accessories", "Electronics & Mobiles", "Textile & Clothing", "Health & Medical", "Food & Restaurants", "Home & Garden", "Education & Training", "Travel & Tourism"],
  },
  {
    title: "Services",
    links: ["Digital Marketing", "Website & App Development", "Branding & Design", "Business Promotion", "Lead Generation", "Online Payments", "Customer Reviews"],
  },
  {
    title: "Entertainment",
    links: ["Parties & DJ Events", "Tech Events", "Business Meets", "Weddings & Occasions", "Movies & Shows", "Parks & Recreation"],
  },
  {
    title: "Cities",
    links: ["Chennai", "Coimbatore", "Madurai", "Bengaluru", "Hyderabad", "Kochi"],
  },
];
