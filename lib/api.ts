import { FileWithPreview, LeafScanResult } from "./types";

export async function scanLeafImage(
  file: FileWithPreview
): Promise<LeafScanResult> {
  if (!file) {
    throw new Error("No file provided");
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://trees.firstasia.edu.ph/api/upload", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const result: LeafScanResult = await response.json();

    // Handle different scan result scenarios
    if (result.leaf_detected) {
      console.log("Result: ", result);
    } else {
      console.log("No leaf detected");
    }

    return result;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
}
