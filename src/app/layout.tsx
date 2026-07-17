import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "N-ME App — Find Businesses, Services, Jobs & Offers",
    template: "%s | N-ME App",
  },
  description:
    "All your needs are simplified, secure, and just a tap away in one app. Discover local businesses, services, jobs and exclusive offers.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  return (
    // suppressHydrationWarning: browser extensions / AV web shields (Avast is
    // active on this dev machine) inject attributes into <html>/<body> before
    // React hydrates. The suppression only applies one level deep, so real
    // hydration bugs inside the app still surface.
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <Header user={user} />
        {/* pb makes room for the mobile bottom tab bar */}
        <div className="pb-20 md:pb-0">{children}</div>
        <Footer />
        <MobileNav loggedIn={Boolean(user)} />
      </body>
    </html>
  );
}
