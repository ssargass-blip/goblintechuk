import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "GoblinTechUK hunts the best UK tech, gaming and electronics deals so you don’t have to.";

export const metadata: Metadata = {
  metadataBase: new URL("https://goblintechuk.uk"),
  title: "GoblinTechUK - UK Tech Deal Hunter",
  description,
  icons: {
    icon: "/goblin-logo.png",
    shortcut: "/goblin-logo.png",
    apple: "/goblin-logo.png",
  },
  openGraph: {
    title: "GoblinTechUK - UK Tech Deal Hunter",
    description,
    url: "https://goblintechuk.uk",
    siteName: "GoblinTechUK",
    images: [
      {
        url: "/goblin-wallpaper.png",
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
    images: ["/goblin-wallpaper.png"],
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
