// components/component/NetworkStatusIndicator.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useOnlineStatus } from "@/utils/networkDetector";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import ModelLoader from "@/services/modelLoader";

export default function NetworkStatusIndicator() {
  const isOnline = useOnlineStatus();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Check if models are loaded
    const interval = setInterval(() => {
      const modelLoader = ModelLoader.getInstance();
      setModelsLoaded(modelLoader.areModelsLoaded());
    }, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, []);

  // Show indicator briefly when status changes
  useEffect(() => {
    setShowIndicator(true);
    const timer = setTimeout(() => {
      setShowIndicator(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOnline, modelsLoaded]);

  if (!showIndicator) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full transition-opacity duration-300",
        isOnline ? "bg-green-500 text-white" : "bg-yellow-500 text-white",
        showIndicator ? "opacity-100" : "opacity-0"
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-xs font-medium">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-xs font-medium">
            {modelsLoaded ? "Offline Mode Ready" : "Offline Mode Loading..."}
          </span>
        </>
      )}
    </div>
  );
}
