import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fundora",
  description: "A modern web application built with Next.js 15 that replicates core Patreon functionality. This project serves as a crowdfunding platform where creators can receive financial support from their audience through subscription-based memberships.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col text-white`}
      >
        <SessionWrapper>
        <Navbar />
        <div className="flex-1 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </div>
        <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
