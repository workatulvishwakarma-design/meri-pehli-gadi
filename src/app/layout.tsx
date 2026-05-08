import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getGlobalSchemas } from "@/lib/schema-markup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeriPehli Gadi - Buy, Sell, Finance & Insure Used Cars in Assam | Trusted Marketplace",
  description:
    "MeriPehli Gadi helps customers in Assam buy, sell, finance and insure used cars with trust, transparency and local support. Pehli car ka sapna, ab aur aasaan. Powered by Shani Finserve.",
  keywords: [
    "used cars Assam", "buy used car Guwahati", "sell car Dibrugarh",
    "used car loan Assam", "car insurance Assam", "MeriPehli Gadi",
    "Shani Finserve", "used cars Dibrugarh", "certified used cars Assam",
    "second hand cars Guwahati", "car finance Northeast India",
    "used car marketplace Assam", "used Maruti cars Assam",
    "used Hyundai cars Assam", "used Tata cars Assam",
    "used SUV Assam", "budget cars Assam", "first car Assam",
  ],
  authors: [{ name: "MeriPehli Gadi", url: "https://meripehligadi.com" }],
  creator: "MeriPehli Gadi",
  publisher: "MeriPehli Gadi",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "MeriPehli Gadi - Assam's Trusted Used Car Marketplace",
    description: "Buy, sell, finance and insure used cars in Assam with trust and transparency. Powered by Shani Finserve.",
    siteName: "MeriPehli Gadi",
    type: "website",
    locale: "en_IN",
    url: "https://meripehligadi.com",
    images: [
      {
        url: "/logo.png",
        width: 200,
        height: 60,
        alt: "MeriPehli Gadi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MeriPehli Gadi - Assam's Trusted Used Car Marketplace",
    description: "Buy, sell, finance and insure used cars in Assam with trust, transparency and local support.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://meripehligadi.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CityModal } from "@/components/layout/CityModal";
import { AuthModal } from "@/components/layout/AuthModal";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import StickyMobileBar from "@/components/layout/StickyMobileBar";
import FloatingCarChatButton from "@/components/chatbot/FloatingCarChatButton";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate global JSON-LD schemas
  const globalSchemas = getGlobalSchemas();
  const schemaArray = Object.values(globalSchemas);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />

        {/* llms.txt for AI crawlers */}
        <link rel="ai" href="/llms.txt" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Header />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <CityModal />
          <AuthModal />
          <WhatsAppButton />
          <StickyMobileBar />
          <FloatingCarChatButton />
          <Toaster />
        </ThemeProvider>
        {/* Global JSON-LD Structured Data — rendered outside ThemeProvider to avoid script warnings */}
        {schemaArray.map((schema, index) => (
          <Script
            key={`schema-${index}`}
            id={`json-ld-${index}`}
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </body>
    </html>
  );
}
