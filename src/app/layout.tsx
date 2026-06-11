import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sansModern = Plus_Jakarta_Sans({
  variable: "--font-sans-modern",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bengali = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kolkata Alive | Immerse in the Living Heritage & Memories",
  description: "A cinematic AI-powered cultural preservation platform that brings Kolkata's streets, landmarks, literature, trams, and oral histories to life.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${sansModern.variable} ${bengali.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream text-charcoal font-sans flex flex-col relative">
        {/* Cinematic Vintage Paper Grain Overlay */}
        <div className="vintage-grain" />

        {/* Global Page Wrap */}
        <div className="flex-1 flex flex-col z-10">{children}</div>
      </body>
    </html>
  );
}
