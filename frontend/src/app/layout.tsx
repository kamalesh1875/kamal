import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/layout/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1B4332",
};

export const metadata: Metadata = {
  title: "GoatFarm OS — MSK Commercial Livestock ERP + POS",
  description: "Enterprise livestock management, growth tracking, true cost accounting, and fast POS invoicing platform.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAF7] text-slate-900 font-sans">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
