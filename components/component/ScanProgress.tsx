"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
import { loadingMessages } from "@/lib/data";

interface ScanProgressProps {
  isScanning: boolean;
  file: File | null;
  messageStyle?: keyof typeof loadingMessages;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({
  isScanning,
  file,
  messageStyle = "casual",
}) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");

  const getRandomMessage = useCallback(() => {
    const messages = loadingMessages[messageStyle];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }, [messageStyle]);

  // Reset progress when scanning completes
  useEffect(() => {
    if (!isScanning) {
      setProgress(0);
    }
  }, [isScanning]);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let messageInterval: NodeJS.Timeout;

    if (isScanning && file) {
      setProgress(0);
      setCurrentMessage(getRandomMessage());

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 60) return prev + 5;
          if (prev < 90) return prev + 2;
          if (prev < 95) return prev + 0.5;
          return prev;
        });
      }, 100);

      messageInterval = setInterval(() => {
        setCurrentMessage(getRandomMessage());
      }, 2000);
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isScanning, file, getRandomMessage]);

  // Only show during active scanning
  if (!isScanning || !file) return null;

  return (
    <div className="w-[245px] mr-8">
      <Progress className="h-3 mt-2" value={progress} />
      <p className="text-sm text-green-800 text-center mt-2">
        {currentMessage}
      </p>
    </div>
  );
};
