import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GoatFarm OS — MSK Commercial Livestock ERP + POS",
  description: "Enterprise livestock management, growth tracking, true cost accounting, and fast POS invoicing platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAF7] text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
