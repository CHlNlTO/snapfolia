import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/component/Navbar";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { UserGuideProvider } from "@/contexts/UserGuideContext";
import Script from "next/script";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snapfolia",
  description: "A leaf classifier application with offline capabilities",
  manifest: "/manifest.json",
  themeColor: "#10b981",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Snapfolia",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <UserGuideProvider>
          <Navbar />
          {children}
          <Analytics />
        </UserGuideProvider>

        {/* Register service worker */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>

        {/* Preload TensorFlow.js */}
        <Script
          src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
