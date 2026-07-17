/**
 * ─── FOOTER PAGES: LOCAL FALLBACK ────────────────────────────────────────────
 * The footer's Quick Link / Support columns load from the backend's
 * website_footer_pages table (website_footer_links + website_page/{slug},
 * gated by app_settings.website_api_key). Until that key is configured — or
 * whenever the API is unreachable — the same 15 pages render from this file,
 * so every footer link always opens a real content page.
 *
 * Content mirrors the backend seed (dbchanges.sql) where it exists. Once the
 * API key is set, admin-managed content automatically takes priority.
 */

export interface FallbackFooterPage {
  title: string;
  slug: string;
  /** Footer column: "Quick Link" or "Support" (API group "Company" maps to Quick Link). */
  group: "Quick Link" | "Support";
  content: string; // HTML
}

export const fallbackFooterPages: FallbackFooterPage[] = [
  // ── Quick Link ──────────────────────────────────────────────────────────
  {
    title: "About Us",
    slug: "about-us",
    group: "Quick Link",
    content:
      "<h4>What is N-Me App?</h4><p>N-Me is a business discovery and service connection platform designed to help users find nearby businesses, shops and professionals and to help sellers and service providers promote themselves online. Think of it as a modern, digital directory or marketplace that connects people and businesses in one place.</p>",
  },
  {
    title: "Contact Us",
    slug: "contact-us",
    group: "Quick Link",
    content:
      "<h4>Get in Touch</h4><p>We would love to hear from you. Whether you have a question about your listing, need help with the app, or just want to share feedback, our team is here to help.</p><p><strong>Email:</strong> support@nmeapp.com<br><strong>Phone:</strong> +91 00000 00000<br><strong>Address:</strong> N-Me Technologies, Kozhikode, Kerala, India</p>",
  },
  {
    title: "Advertise With Us",
    slug: "advertise-with-us",
    group: "Quick Link",
    content:
      "<h4>Grow Your Business With N-Me</h4><p>Reach thousands of nearby customers actively searching for businesses like yours. From featured listings and homepage banners to category placements, N-Me offers flexible advertising options to help your business stand out.</p><p>Contact our sales team to learn more about advertising packages and pricing.</p>",
  },
  {
    title: "Free Business Listing",
    slug: "free-business-listing",
    group: "Quick Link",
    content:
      "<h4>List Your Business for Free</h4><p>Getting your business discovered on N-Me is simple and free. Create your listing in minutes, add your photos, services, and contact details, and start connecting with customers in your area today.</p><p>No hidden fees for a basic listing — just sign up and get discovered.</p>",
  },
  {
    title: "Customer Support",
    slug: "customer-support",
    group: "Quick Link",
    content:
      "<h4>We Are Here to Help</h4><p>Our Customer Support team is available to assist you with account issues, listing management, technical problems, or general questions about using N-Me.</p><p>Reach out anytime and we will get back to you as soon as possible.</p>",
  },
  {
    title: "Careers",
    slug: "careers",
    group: "Quick Link",
    content:
      "<h4>Join Our Team</h4><p>We are always looking for talented, driven people who want to help build the future of local business discovery. Explore our current openings and become part of the N-Me journey.</p><p>No open positions listed right now — check back soon or send us your resume for future opportunities.</p>",
  },
  {
    title: "Feedback",
    slug: "feedback",
    group: "Quick Link",
    content:
      "<h4>We Value Your Feedback</h4><p>Your experience matters to us. Whether it is a suggestion, a compliment, or something we could do better, we want to hear it. Your feedback directly shapes how we improve N-Me for everyone.</p>",
  },
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    group: "Quick Link",
    content:
      "<h4>Privacy Policy</h4><p>This Privacy Policy explains how N-Me collects, uses, and protects your personal information when you use our platform. We are committed to safeguarding your privacy and being transparent about our data practices.</p><p><em>This is placeholder content — replace with your finalized privacy policy before going live.</em></p>",
  },
  {
    title: "Terms & Conditions",
    slug: "terms-conditions",
    group: "Quick Link",
    content:
      "<h4>Terms &amp; Conditions</h4><p>By accessing or using the N-Me platform, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.</p><p><em>This is placeholder content — replace with your finalized terms before going live.</em></p>",
  },
  // ── Support ─────────────────────────────────────────────────────────────
  {
    title: "Help Center",
    slug: "help-center",
    group: "Support",
    content:
      "<h4>Help Center</h4><p>Find answers to common questions, step-by-step guides, and troubleshooting tips for using N-Me — whether you are searching for a business or managing your own listing.</p>",
  },
  {
    title: "Report an Issue",
    slug: "report-an-issue",
    group: "Support",
    content:
      "<h4>Report an Issue</h4><p>Noticed something wrong — an incorrect listing, inappropriate content, or a bug in the app? Let us know and our team will look into it promptly.</p>",
  },
  {
    title: "FAQs",
    slug: "faqs",
    group: "Support",
    content:
      "<h4>Frequently Asked Questions</h4><p><strong>How do I list my business on N-Me?</strong><br>Sign up for a free account and add your business details in minutes.</p><p><strong>Is N-Me free to use?</strong><br>Yes, browsing and basic business listings are free. Optional premium features are also available.</p><p><strong>How do I contact a listed business?</strong><br>Each business profile includes contact details such as phone number and WhatsApp.</p>",
  },
  {
    title: "Business Verification",
    slug: "business-verification",
    group: "Support",
    content:
      "<h4>Business Verification</h4><p>Verified businesses build more trust with customers. Our verification process confirms your business identity, contact details, and location so users know your listing is genuine.</p><p>To get verified, keep your listing details up to date and contact our support team with your business registration documents.</p>",
  },
  {
    title: "Return & Refund",
    slug: "return-refund",
    group: "Support",
    content:
      "<h4>Return &amp; Refund Policy</h4><p>Purchases and bookings made through listed businesses are governed by each business's own return and refund terms. Please confirm the terms with the business before making a payment.</p><p>For issues with payments made to N-Me itself (such as advertising or premium listings), contact our support team and we will review your request promptly.</p>",
  },
  {
    title: "Policy",
    slug: "policy",
    group: "Support",
    content:
      "<h4>Platform Policies</h4><p>Our policies keep N-Me safe and useful for everyone — covering acceptable listing content, prohibited items and services, review integrity, and fair usage of the platform.</p><p>Listings that violate these policies may be removed, and repeated violations can lead to account suspension.</p>",
  },
];

export function findFallbackPage(slug: string): FallbackFooterPage | undefined {
  return fallbackFooterPages.find((p) => p.slug === slug);
}
