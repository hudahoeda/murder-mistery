import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Murder Mystery at Stasiun Manggarai",
  description: "A thrilling turn-based murder mystery game set in Jakarta's busiest railway station. Solve puzzles, gather clues, and unmask the killer.",
  keywords: ["murder mystery", "puzzle game", "team building", "detective game", "railway station"],
  authors: [{ name: "Murder Mystery Game Team" }],
};

export const viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-slate-900 text-slate-100 antialiased font-sans`}
      >
        <div className="relative min-h-screen">
          {/* Film noir atmospheric background */}
          <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90 -z-10" />
          <div className="fixed inset-0 bg-[url('https://media.istockphoto.com/id/475888448/photo/generic-abstract-of-old-subway-wall-with-blue-tiles.jpg?s=612x612&w=0&k=20&c=9djQJbT5yVBAaTgXUxRaEbnlGQPRZAR3k7TeBf3sBgk=')] opacity-5 -z-10" />
          
          {/* Main content */}
          <main className="relative z-10">
            {children}
          </main>
          
          {/* Atmospheric overlay for depth */}
          <div className="fixed inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-slate-900/10 pointer-events-none -z-5" />
        </div>
      </body>
    </html>
  );
}
