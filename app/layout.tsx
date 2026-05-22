import type { Metadata } from "next";
import { Newsreader, Work_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Westside — Curated Vintage Menswear",
  description: "Hand-curated vintage clothing from the 1960s–1990s. Based in Jericho, Ibadan.",
  openGraph: {
    title: "Westside",
    description: "Curated vintage for the modern wardrobe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${newsreader.variable} ${workSans.variable} ${spaceMono.variable} overflow-x-hidden`}
      >
        {/* Film grain overlay */}
        <div className="grain-overlay fixed inset-0 z-[60] pointer-events-none" />

        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
