import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeriPehli Gadi - Buy, Sell, Finance & Insure Used Cars | Trusted Car Marketplace",
  description:
    "MeriPehli Gadi helps customers buy, sell, finance and insure used cars with trust, transparency and local support. Har family ki pehli car ka sapna, ab aur aasaan.",
  keywords: [
    "used cars", "buy used car", "sell car", "car finance", "car insurance",
    "MeriPehli Gadi", "Shani Finserve", "used cars Dibrugarh", "used cars Assam",
    "certified used cars", "car loan", "used car marketplace",
  ],
  authors: [{ name: "MeriPehli Gadi" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "MeriPehli Gadi - Trusted Used Car Marketplace",
    description: "Buy, sell, finance and insure used cars with trust and transparency.",
    siteName: "MeriPehli Gadi",
    type: "website",
    locale: "en_IN",
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
