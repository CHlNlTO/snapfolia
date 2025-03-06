// components/component/PwaInstallPrompt.tsx
"use client";

import { useEffect, useState } from "react";

// Define the BeforeInstallPromptEvent type
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
import { Button } from "../ui/button";
import { Download, X } from "lucide-react";

export default function PwaInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    if (isAppInstalled) {
      // App is already installed, don't show the prompt
      return;
    }

    // Store the beforeinstallprompt event for later use
    window.addEventListener("beforeinstallprompt", (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      // Prevent the default behavior of the browser
      promptEvent.preventDefault();

      // Store the event for later use
      setDeferredPrompt(promptEvent);

      // Check if user has previously dismissed the prompt
      const hasUserDismissed = localStorage.getItem("pwaPromptDismissed");

      if (!hasUserDismissed) {
        // Show our custom install prompt
        setShowPrompt(true);
      }
    });

    // Clean up
    return () => {
      window.removeEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
      });
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the browser's install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the deferred prompt variable
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    // Remember that the user dismissed the prompt
    localStorage.setItem("pwaPromptDismissed", "true");
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-full">
          <Download className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-medium text-sm">Install Snapfolia</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Install for faster access and offline use
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-end space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-xs"
        >
          Not now
        </Button>
        <Button
          onClick={handleInstall}
          size="sm"
          className="text-xs bg-green-600 hover:bg-green-700"
        >
          Install
        </Button>
      </div>
    </div>
  );
}
