// app/layout.tsx
"use client";

// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/component/Navbar";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { UserGuideProvider } from "@/contexts/UserGuideContext";
import NetworkStatusIndicator from "@/components/component/NetworkStatusIndicator";
import { useEffect } from "react";
import { preloadModels } from "@/lib/api";
import ServiceWorkerInit from "@/components/component/ServiceWorkerInit";
import PwaInstallPrompt from "@/components/component/PwaInstallPrompt";

const inter = Inter({ subsets: ["latin"] });

// Metadata moved to a separate export
// export const metadata: Metadata = {
//   title: "Snapfolia",
//   description: "A leaf classifier application",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Preload models in the background
  useEffect(() => {
    // Use requestIdleCallback or setTimeout to delay loading until the page is idle
    if (typeof window !== "undefined") {
      const loadModels = () => {
        console.log("Preloading models in background...");
        preloadModels().catch((error) => {
          console.warn("Failed to preload models:", error);
        });
      };

      if ("requestIdleCallback" in window) {
        (
          window as unknown as {
            requestIdleCallback: (
              callback: () => void,
              options?: { timeout: number }
            ) => void;
          }
        ).requestIdleCallback(loadModels, { timeout: 5000 });
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(loadModels, 3000);
      }
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#22c55e" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <UserGuideProvider>
          <Navbar />
          {children}
          <NetworkStatusIndicator />
          <ServiceWorkerInit />
          <PwaInstallPrompt />
          <Analytics />
        </UserGuideProvider>
      </body>
    </html>
  );
}
