import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/component/Navbar";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snapfolia",
  description: "A leaf classifier application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
