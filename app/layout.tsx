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

export const metadata: Metadata = {
  title: "Sri Lankan Exchange Rates | Live Currency Rates from Sampath Bank",
  description:
    "Get real-time Sri Lankan exchange rates from Sampath Bank. Track and monitor currency exchange rates with our user-friendly interface. Bookmark your favorite currencies for quick access.",
  keywords:
    "Sri Lanka exchange rates, Sampath Bank rates, currency converter, LKR exchange rates, foreign currency rates Sri Lanka",
  authors: [{ name: "SL Exchange Rate" }],
  openGraph: {
    title: "Sri Lankan Exchange Rates | Live Currency Rates",
    description:
      "Get real-time Sri Lankan exchange rates from Sampath Bank. Track your favorite currencies easily.",
    type: "website",
    locale: "en_US",
    siteName: "SL Exchange Rate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Lankan Exchange Rates | Live Currency Rates",
    description:
      "Get real-time Sri Lankan exchange rates from Sampath Bank. Track your favorite currencies easily.",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
