import type { Metadata } from "next";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { Nav } from "@/components/Nav";
import { LOGO } from "@/lib/assets";
import "./globals.css";

const SITE = "https://gomylz.com";
const DESCRIPTION =
  "Tell mylz your trip in one sentence. It finds flights and stays and books them for you, with a real person on hand if anything goes wrong. IATA accredited.";

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
  logo: LOGO.src,
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
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=Outfit:wght@400;500;600&family=Syne:wght@700&display=swap"
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <CurrencyProvider>
          <div className="shell" id="top">
            <Nav />
            {children}
            <footer className="footer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="footer-logo" src={LOGO.src} alt="mylz" width={LOGO.width} height={LOGO.height} loading="lazy" />
              <nav aria-label="Legal">
                <a href="https://gomylz.com/terms-and-conditions">Terms</a>
                <a href="https://gomylz.com/privacy">Privacy</a>
                <a href="https://gomylz.com/sanctions-compliance">Sanctions compliance</a>
              </nav>
              <span>© 2026 Milesfactory Limited · No. 16131941 · IATA TIDS 96192412</span>
            </footer>
          </div>
        </CurrencyProvider>
      </body>
    </html>
  );
}
