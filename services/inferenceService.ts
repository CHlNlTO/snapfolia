// services/inferenceService.ts

import * as tf from "@tensorflow/tfjs";
import ModelLoader from "./modelLoader";
import { LeafClass, LeafScanResult } from "@/lib/types";
import { ScanErrorType, createErrorResponse } from "@/lib/errors";

// Class mapping for classification
const CLASS_MAPPING = [
  "Acacia",
  "Alagao",
  "Alibangbang",
  "Amugis",
  "Antipolo",
  "Apitong",
  "Asis",
  "Balayong",
  "Balete",
  "Banaba",
  "Bani",
  "Barako",
  "Bayabas",
  "Betis",
  "Binunga",
  "Dao",
  "Dita",
  "Duhat",
  "Eucalyptus",
  "Guyabano",
  "Hinadyong",
  "Ilang-Ilang",
  "Inyam",
  "Ipil",
  "Kalios",
  "Kamagong",
  "Langka",
  "Lansones",
  "Madre-Cacao",
  "Mahogany",
  "Mangga",
  "Mulawin",
  "Narra",
  "Palo-Maria",
  "Santol",
  "Scramble-Egg",
  "Sintores",
  "Talisay",
  "Tibig",
  "Yakal",
];

export async function preprocessImage(file: File): Promise<{
  tensor: tf.Tensor;
  canvas: HTMLCanvasElement;
}> {
  console.log("Preprocessing image:", file.name, file.type, file.size);
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        console.log(
          "Image loaded successfully. Original dimensions:",
          img.width,
          "x",
          img.height
        );
        // Create a canvas element to resize the image
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 640;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Draw image to canvas with resize
        ctx.drawImage(img, 0, 0, 640, 640);
        console.log("Image resized to 640x640 on canvas");

        // Convert canvas to tensor
        const tensor = tf.browser
          .fromPixels(canvas)
          .toFloat()
          .div(255.0)
          .expandDims(0);

        console.log("Image converted to tensor with shape:", tensor.shape);
        resolve({ tensor, canvas });
      };

      img.onerror = (error) => {
        console.error("Failed to load image:", error);
        reject(new Error("Failed to load image"));
      };

      // Load image from file
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error("Error in preprocessing:", error);
      reject(error);
    }
  });
}

// Helper function to check if model is a GraphModel
function isGraphModel(
  model: tf.GraphModel | tf.LayersModel
): model is tf.GraphModel {
  return "execute" in model && typeof model.execute === "function";
}

// Function to check if the image contains significant green content (common in leaves)
function isGreenDominant(canvas: HTMLCanvasElement, threshold = 0.2): boolean {
  try {
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let greenPixels = 0;
    const totalPixels = canvas.width * canvas.height;

    // Check each pixel for green dominance
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Green is dominant if it's the highest value and above a certain threshold
      // Also ensure it's not just white or gray (where R=G=B)
      if (g > r && g > b && g > 100 && g > 1.1 * r && g > 1.1 * b) {
        greenPixels++;
      }
    }

    const greenRatio = greenPixels / totalPixels;
    console.log(`Green pixel ratio: ${(greenRatio * 100).toFixed(2)}%`);
    return greenRatio > threshold;
  } catch (error) {
    console.error("Error analyzing image colors:", error);
    return false;
  }
}

// Function to analyze YOLOv8 detection output with proper TypeScript typing
async function analyzeDetectionOutput(
  detectionResults: tf.Tensor | tf.Tensor[]
): Promise<boolean> {
  try {
    console.log("Analyzing detection output...");
    const CONFIDENCE_THRESHOLD = 0.65; // Higher threshold to be stricter

    if (Array.isArray(detectionResults)) {
      // Try to find the detection outputs in the tensor array
      console.log(`Model returned ${detectionResults.length} tensors`);

      // Log tensor shapes for debugging
      for (let i = 0; i < detectionResults.length; i++) {
        console.log(`Tensor ${i} shape:`, detectionResults[i].shape);
      }

      // Try the first tensor (most common for detection output)
      if (detectionResults.length > 0) {
        const firstTensor = detectionResults[0];
        const data = await firstTensor.arraySync();

        // Safe type checking
        if (data && typeof data === "object") {
          if (Array.isArray(data)) {
            console.log(`First tensor data is array of length ${data.length}`);

            if (data.length > 0 && Array.isArray(data[0])) {
              // This is likely a batch of detections
              console.log(`First element is array of length ${data[0].length}`);

              // In YOLOv8, confidence score is typically at index 4
              let highestConfidence = 0;

              for (const row of data) {
                if (Array.isArray(row)) {
                  for (const detection of row) {
                    if (Array.isArray(detection) && detection.length > 4) {
                      const confidence = detection[4];
                      if (
                        typeof confidence === "number" &&
                        confidence > highestConfidence
                      ) {
                        highestConfidence = confidence;
                      }
                    }
                  }
                }
              }

              console.log(`Highest detection confidence: ${highestConfidence}`);
              return highestConfidence > CONFIDENCE_THRESHOLD;
            }
          }
        }
      }
    } else {
      // Single tensor output
      const data = await detectionResults.arraySync();

      if (data && typeof data === "object") {
        if (Array.isArray(data)) {
          console.log(`Single tensor data is array of length ${data.length}`);

          if (data.length > 0 && Array.isArray(data[0])) {
            // Process similar to multi-tensor case
            let highestConfidence = 0;

            for (const row of data) {
              if (Array.isArray(row)) {
                for (const detection of row) {
                  if (Array.isArray(detection) && detection.length > 4) {
                    const confidence = detection[4];
                    if (
                      typeof confidence === "number" &&
                      confidence > highestConfidence
                    ) {
                      highestConfidence = confidence;
                    }
                  }
                }
              }
            }

            console.log(`Highest detection confidence: ${highestConfidence}`);
            return highestConfidence > CONFIDENCE_THRESHOLD;
          }
        }
      }
    }

    console.log("Could not find valid detection output structure");
    return false;
  } catch (error) {
    console.error("Error analyzing detection output:", error);
    return false;
  }
}

export async function detectAndClassify(file: File): Promise<LeafScanResult> {
  console.log("Starting detection and classification for file:", file.name);

  try {
    const modelLoader = ModelLoader.getInstance();
    console.log("Loading models...");
    await modelLoader.loadModels();
    console.log("Models loaded successfully");

    console.log("Preprocessing image...");
    const { tensor: imageTensor, canvas } = await preprocessImage(file);
    console.log("Image preprocessing complete");

    // Check for significant green content (common in leaves)
    const hasGreenContent = isGreenDominant(canvas);
    console.log(`Image has significant green content: ${hasGreenContent}`);

    if (!hasGreenContent) {
      console.log("Image doesn't contain enough green content for a leaf");
      imageTensor.dispose();
      return {
        leaf_detected: false,
        success: true,
        message: "No leaf detected. Please upload a clear image of a leaf.",
        classes: [],
        error: null,
      };
    }

    // Run object detection
    console.log("Running object detection model...");
    const detectionModel = modelLoader.getDetectionModel();
    console.log(
      "Detection model type:",
      isGraphModel(detectionModel) ? "GraphModel" : "LayersModel"
    );

    let detectionResults: tf.Tensor | tf.Tensor[];
    const startTime = performance.now();

    if (isGraphModel(detectionModel)) {
      // GraphModel (saved_model) approach
      console.log("Executing GraphModel for detection...");
      detectionResults = detectionModel.execute(imageTensor) as tf.Tensor[];
    } else {
      // LayersModel (Keras) approach
      console.log("Predicting with LayersModel for detection...");
      detectionResults = detectionModel.predict(imageTensor) as tf.Tensor[];
    }

    const endTime = performance.now();
    console.log(`Detection completed in ${endTime - startTime}ms`);

    // Analyze detection results
    const leafDetected = await analyzeDetectionOutput(detectionResults);
    console.log(`Leaf detection result: ${leafDetected}`);

    // Clean up detection tensors
    console.log("Cleaning up detection tensors...");
    if (Array.isArray(detectionResults)) {
      detectionResults.forEach((tensor) => tensor.dispose());
    } else {
      (detectionResults as tf.Tensor).dispose();
    }

    // If no leaf detected, return early
    if (!leafDetected) {
      console.log("No leaf detected, skipping classification");
      imageTensor.dispose();
      return {
        leaf_detected: false,
        success: true,
        message: "No leaf detected. Please upload a clear image of a leaf.",
        classes: [],
        error: null,
      };
    }

    // Run classification since leaf was detected
    console.log("Leaf detected, running classification model...");
    const classificationModel = modelLoader.getClassificationModel();
    console.log(
      "Classification model type:",
      isGraphModel(classificationModel) ? "GraphModel" : "LayersModel"
    );

    let classificationResults: tf.Tensor;
    const classStartTime = performance.now();

    if (isGraphModel(classificationModel)) {
      // GraphModel approach
      console.log("Executing GraphModel for classification...");
      classificationResults = classificationModel.execute(
        imageTensor
      ) as tf.Tensor;
    } else {
      // LayersModel approach
      console.log("Predicting with LayersModel for classification...");
      classificationResults = classificationModel.predict(
        imageTensor
      ) as tf.Tensor;
    }

    const classEndTime = performance.now();
    console.log(
      `Classification completed in ${classEndTime - classStartTime}ms`
    );

    // Get probabilities
    console.log("Processing classification results...");
    const logits = (await classificationResults.arraySync()) as number[][];

    classificationResults.dispose();
    imageTensor.dispose();

    // Process the logits
    const probabilities = logits[0] || logits;

    // Get indices sorted by probability (descending)
    const indices = Array.from(Array(probabilities.length).keys())
      .sort((a, b) => probabilities[b] - probabilities[a])
      .slice(0, 5);

    // Create classes array for response
    const classes: LeafClass[] = indices.map((index) => ({
      class: CLASS_MAPPING[index],
      confidence: probabilities[index] * 100,
    }));

    // Check if the highest confidence is too low, which suggests it's not a leaf
    const topConfidence = classes[0]?.confidence || 0;
    if (topConfidence < 15) {
      // 15% threshold
      console.log(
        `Top classification confidence too low (${topConfidence.toFixed(
          2
        )}%), likely not a leaf`
      );
      return {
        leaf_detected: false,
        success: true,
        message:
          "No leaf could be confidently identified. Please upload a clearer image.",
        classes: [],
        error: null,
      };
    }

    console.log("Final classification results:", classes);

    return {
      leaf_detected: true,
      success: true,
      message: "Leaf detected and classified successfully",
      classes,
      error: null,
    };
  } catch (error) {
    console.error("Error in inference process:", error);
    return createErrorResponse({
      type: ScanErrorType.UNKNOWN,
      message: "Error processing image",
      details:
        error instanceof Error
          ? error.message
          : "Unknown error during inference",
    });
  }
}
