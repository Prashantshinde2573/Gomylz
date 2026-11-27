import type { Metadata } from "next";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { LOGO } from "@/lib/assets";
import "./globals.css";

const SITE = "https://gomylz.com";
const DESCRIPTION =
  "Search flights and stays with mylzAI. Describe your trip by voice or text, or use the search form to compare options.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Mylz | Talk. Book. Go.",
  description: DESCRIPTION,
  openGraph: {
    title: "Mylz | Talk. Book. Go.",
    description: DESCRIPTION,
    url: SITE,
    siteName: "mylz",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "mylz: Talk. Book. Go." }],
  },
  twitter: { card: "summary_large_image", title: "Mylz | Talk. Book. Go.", description: DESCRIPTION, images: ["/og.jpg"] },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "mylz",
  legalName: "Milesfactory Limited",
  url: SITE,
  logo: new URL(LOGO.src, SITE).href,
  description: DESCRIPTION,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap"
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <CurrencyProvider>
          <div className="shell" id="top">
            {children}
            <SiteFooter />
          </div>
        </CurrencyProvider>
      </body>
    </html>
  );
}
