import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Assistant from "@/components/dashboard/Assistant";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const viewport: Viewport = {
  themeColor: "#D2042D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "VoteGuide | Your Interactive Election Assistant (South India 2026)",
  description: "Understand electoral processes, track crowd levels, and find your polling booth for the 2026 Assembly Elections in Tamil Nadu, Kerala, and beyond.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VoteGuide",
  },
  keywords: ["Election 2026", "Tamil Nadu Election", "Kerala Election", "Voter Guide India", "Poll Crowd Tracking"],
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow pt-24">
            {children}
          </main>
          <Footer />
          <Assistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
