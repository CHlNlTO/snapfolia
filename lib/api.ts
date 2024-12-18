"use server";

import { LeafScanResult } from "./types";

export async function scanLeafImage(
  formData: FormData
): Promise<LeafScanResult> {
  try {
    // Get the file from FormData
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Create a new FormData instance for the external API
    const apiFormData = new FormData();
    apiFormData.append("file", file);

    const response = await fetch("https://trees.firstasia.edu.ph/api/upload", {
      method: "POST",
      body: apiFormData,
    });

    if (!response.ok) {
      if (response.statusText === "Bad Gateway") {
        throw new Error("Server is offline.");
      }
      throw new Error(`Slow Internet Connection`); // Catch all other errors
    }

    const result: LeafScanResult = await response.json();

    const userAgent = process;
    const device = userAgent.platform || "Unknown";
    console.dir("Leaf scan result:");

    console.dir(
      {
        result,
        device,
        userAgent: process.platform,
      },
      { depth: null }
    );

    return {
      ...result,
      success: true,
      message: result.leaf_detected
        ? "Leaf successfully detected"
        : "No leaf detected",
    };
  } catch (error) {
    console.error("Leaf scan error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      leaf_detected: false,
    };
  }
}
