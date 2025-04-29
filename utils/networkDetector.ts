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
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    // Instead of just a HEAD request, make a GET request to actually test the connection
    const response = await fetch("https://trees.firstasia.edu.ph/api/", {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    clearTimeout(timeoutId);

    // Log detailed information about the response
    console.log("Server reachability response:", {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
    });

    return response.ok;
  } catch (error) {
    // More detailed error logging
    console.error("Server reachability check failed:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      type: error instanceof Error ? error.constructor.name : typeof error,
    });
    return false;
  }
};
