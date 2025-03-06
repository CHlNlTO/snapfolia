// lib/api.ts
import { LeafScanResult } from "./types";
import { SCAN_ERRORS, createErrorResponse, ScanErrorType } from "./errors";
import { modelService } from "@/services/modelService";

/**
 * Scans a leaf image for classification
 * Will use local model if offline, otherwise use server API
 */
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

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return createErrorResponse(
        SCAN_ERRORS[ScanErrorType.VALIDATION].FILE_TOO_LARGE
      );
    }

    // Check if we're online or offline
    if (!modelService.isNetworkAvailable()) {
      console.log("Network offline, using local model");
      return await classifyWithLocalModel(file);
    }

    // We're online, attempt to use the server API
    try {
      const apiFormData = new FormData();
      apiFormData.append("file", file);

      // Add timeout to fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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
      // Network error or timeout - fallback to local model
      if (
        fetchError &&
        typeof fetchError === "object" &&
        "name" in fetchError &&
        fetchError.name === "AbortError"
      ) {
        console.log("Server request timed out, falling back to local model");
      } else {
        console.log("Network error, falling back to local model");
      }

      // Preload the model for future use even if we're using server now
      modelService
        .loadModel()
        .catch((err) => console.warn("Model preloading failed:", err));

      return await classifyWithLocalModel(file);
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

/**
 * Use the local TensorFlow.js model to classify the image
 */
async function classifyWithLocalModel(file: File): Promise<LeafScanResult> {
  try {
    return await modelService.classifyImage(file);
  } catch (error) {
    console.error("Local model error:", error);
    return createErrorResponse({
      type: ScanErrorType.UNKNOWN,
      message: "Local processing failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
