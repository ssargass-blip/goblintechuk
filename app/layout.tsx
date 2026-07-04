import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.goblintechuk.uk";
const canonicalUrl = `${siteUrl}/`;
const description =
  "GoblinTechUK hunts the best UK tech, gaming, electronics and partner offers, helping shoppers compare current deals from trusted UK retailers without endless scrolling.";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GoblinTechUK",
  url: canonicalUrl,
  description,
  publisher: {
    "@type": "Organization",
    name: "GoblinTechUK",
    url: canonicalUrl,
    logo: `${siteUrl}/goblin-icon.png`,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "GoblinTechUK - UK Tech Deal Hunter",
  description,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/goblin-icon.png",
    shortcut: "/goblin-icon.png",
    apple: "/goblin-icon.png",
  },
  openGraph: {
    title: "GoblinTechUK - UK Tech Deal Hunter",
    description,
    url: canonicalUrl,
    siteName: "GoblinTechUK",
    images: [
      {
        url: "/goblin-wallpaper.webp",
        width: 1536,
        height: 1024,
        alt: "GoblinTechUK tech deal hunter wallpaper",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoblinTechUK - UK Tech Deal Hunter",
    description,
    images: ["/goblin-wallpaper.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="okxe69DlC4Ql8AxKUNrqkQ"
          strategy="afterInteractive"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
