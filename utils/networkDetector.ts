// utils/networkDetector.ts
import { useEffect, useState } from "react";

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

// Check if the API server is reachable
export const checkServerReachability = async (): Promise<boolean> => {
  try {
    await fetch("https://trees.firstasia.edu.ph/api/", {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    // No-cors mode always returns type: 'opaque' which means we can't check status
    // Instead, if the fetch didn't throw, we assume the server is reachable
    return true;
  } catch (error) {
    console.error("Server reachability check failed:", error);
    return false;
  }
};
