import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/landing/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://datasense-ai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DataSense AI — AI-Powered Data Analysis in Seconds",
    template: "%s | DataSense AI",
  },
  description:
    "Upload a CSV or Excel file and get a full data science report in ~30 seconds. Automated data cleaning, EDA, ML recommendations, and Gemini AI insights. No coding required.",
  keywords: [
    "AI data analysis",
    "automated EDA",
    "data science tool",
    "CSV analysis",
    "machine learning recommendations",
    "no-code data science",
    "Gemini AI insights",
  ],
  authors: [{ name: "DataSense AI" }],
  creator: "DataSense AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "DataSense AI",
    title: "DataSense AI — AI-Powered Data Analysis in Seconds",
    description:
      "Turn raw CSV or Excel data into professional reports instantly. AI cleaning, EDA, ML recommendations, and natural language insights. Free forever.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DataSense AI — Intelligent Data Analysis Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DataSense AI — AI-Powered Data Analysis in Seconds",
    description:
      "Upload a CSV. Get a full data science report in 30 seconds. No coding. Free forever.",
    images: ["/og-image.png"],
    creator: "@datasenseai",
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
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "DataSense AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered data analysis platform that automatically cleans, analyzes, and generates professional data science reports from CSV and Excel files in seconds.",
  url: siteUrl,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "87",
    bestRating: "5",
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
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
