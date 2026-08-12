import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpendWise - SME Expense Tracker",
  description: "Track, categorize, and understand business expenses in Naira with SpendWise.",
  keywords: ["SpendWise", "expense tracker", "Naira", "SME finance", "business expenses"],
  authors: [{ name: "SpendWise" }],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
  },
  openGraph: {
    title: "SpendWise - SME Expense Tracker",
    description: "Track, categorize, and understand business expenses in Naira with SpendWise.",
    siteName: "SpendWise",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendWise - SME Expense Tracker",
    description: "Track, categorize, and understand business expenses in Naira with SpendWise.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
