import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { canonicalUrl, siteDescription, siteTitle, siteUrl } from "./lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "GoblinTechUK",
      url: canonicalUrl,
      description: siteDescription,
      logo: { "@type": "ImageObject", url: `${siteUrl}/goblin-icon.png` },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "GoblinTechUK",
      url: canonicalUrl,
      description: siteDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/goblin-icon.png",
    shortcut: "/goblin-icon.png",
    apple: "/goblin-icon.png",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
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
    title: siteTitle,
    description: siteDescription,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}

