import { LeafScanResult } from "./types";
import { SCAN_ERRORS, createErrorResponse, ScanErrorType } from "./errors";

export async function scanLeafImage(
  formData: FormData
): Promise<LeafScanResult> {
  try {
    // Validate file presence
    const file = formData.get("file") as File;
    if (!file) {
      return createErrorResponse(SCAN_ERRORS[ScanErrorType.VALIDATION].NO_FILE);
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return createErrorResponse(
        SCAN_ERRORS[ScanErrorType.VALIDATION].INVALID_TYPE
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return createErrorResponse(
        SCAN_ERRORS[ScanErrorType.VALIDATION].FILE_TOO_LARGE
      );
    }

    const apiFormData = new FormData();
    apiFormData.append("file", file);

    // Add timeout to fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(
        "https://trees.firstasia.edu.ph/api/upload",
        {
          method: "POST",
          body: apiFormData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        switch (response.status) {
          case 502:
          case 503:
          case 504:
            return createErrorResponse(
              SCAN_ERRORS[ScanErrorType.SERVER].UNAVAILABLE
            );
          case 404:
            return createErrorResponse(
              SCAN_ERRORS[ScanErrorType.SERVER].NOTFOUND
            );
          case 429:
            return createErrorResponse(
              SCAN_ERRORS[ScanErrorType.SERVER].OVERLOADED
            );
          default:
            return createErrorResponse({
              type: ScanErrorType.SERVER,
              message: "Server error",
              details: `Error ${response.status}: ${response.statusText}`,
            });
        }
      }

      const result: LeafScanResult = await response.json();
      return {
        ...result,
        success: true,
        message: result.leaf_detected
          ? "Leaf successfully detected"
          : "No leaf detected",
      };
    } catch (fetchError) {
      if (
        fetchError &&
        typeof fetchError === "object" &&
        "name" in fetchError &&
        fetchError.name === "AbortError"
      ) {
        return createErrorResponse(SCAN_ERRORS[ScanErrorType.NETWORK].TIMEOUT);
      }
      return createErrorResponse(SCAN_ERRORS[ScanErrorType.NETWORK].OFFLINE);
    }
  } catch (error) {
    console.error("Leaf scan error:", error);
    return createErrorResponse({
      type: ScanErrorType.UNKNOWN,
      message: "Unexpected error",
      details:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
