// components/component/ServiceWorkerInit.tsx
"use client";

import { useEffect, useState } from "react";
import { Workbox } from "workbox-window";
import { Button } from "../ui/button";

export default function ServiceWorkerInit() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      console.warn("Service Worker not supported");
      return;
    }

    const wb = new Workbox("/sw.js");

    // Add event listeners to handle updates
    wb.addEventListener("waiting", (event) => {
      console.log("A new service worker is waiting to be activated");
      if (event.sw) {
        setWaitingWorker(event.sw);
        setShowReload(true);
      }
    });

    wb.addEventListener("controlling", () => {
      console.log("A new service worker is activated");
      window.location.reload();
    });

    // Register the service worker
    wb.register()
      .then((registration) => {
        console.log("Service Worker registered successfully:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });

    return () => {
      // Clean up
    };
  }, []);

  const handleReload = () => {
    if (waitingWorker) {
      // Send message to the waiting service worker to skip waiting
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      setShowReload(false);
    }
  };

  if (!showReload) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <p className="text-sm mb-2">New version available</p>
      <Button onClick={handleReload} className="text-xs">
        Reload to update
      </Button>
    </div>
  );
}
