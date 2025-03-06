// services/inferenceService.ts
import * as tf from "@tensorflow/tfjs";
import ModelLoader from "./modelLoader";
import { LeafClass, LeafScanResult } from "@/lib/types";
import { ScanErrorType, createErrorResponse } from "@/lib/errors";

// This mapping should match your Python backend class names
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

export async function preprocessImage(file: File): Promise<tf.Tensor> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
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

        // Convert canvas to tensor
        const tensor = tf.browser
          .fromPixels(canvas)
          .toFloat()
          .div(255.0)
          .expandDims(0);

        resolve(tensor);
      };

      img.onerror = (error) => {
        reject(new Error("Failed to load image: " + error));
      };

      // Load image from file
      img.src = URL.createObjectURL(file);
    } catch (error) {
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

export async function detectAndClassify(file: File): Promise<LeafScanResult> {
  try {
    const modelLoader = ModelLoader.getInstance();
    await modelLoader.loadModels();

    const imageTensor = await preprocessImage(file);

    // Run object detection
    const detectionModel = modelLoader.getDetectionModel();
    let detectionResults: tf.Tensor | tf.Tensor[];

    if (isGraphModel(detectionModel)) {
      // GraphModel (saved_model) approach
      detectionResults = detectionModel.execute(imageTensor) as tf.Tensor[];
    } else {
      // LayersModel (Keras) approach
      detectionResults = detectionModel.predict(imageTensor) as tf.Tensor[];
    }

    // Process detection results
    // Note: The structure of results will depend on your model's output
    // This is a simplification - you may need to adjust based on your specific model
    let scores: number[][];

    if (Array.isArray(detectionResults)) {
      // If the model returns multiple tensors, assume the second one contains scores
      scores = (await detectionResults[1].arraySync()) as number[][];
    } else {
      // If the model returns a single tensor, assume it contains scores
      scores = (await (
        detectionResults as tf.Tensor
      ).arraySync()) as number[][];
    }

    // Clean up tensors
    if (Array.isArray(detectionResults)) {
      detectionResults.forEach((tensor) => tensor.dispose());
    } else {
      (detectionResults as tf.Tensor).dispose();
    }

    if (
      !scores ||
      scores.length === 0 ||
      scores[0].length === 0 ||
      scores[0][0] < 0.5
    ) {
      // No leaf detected with sufficient confidence
      imageTensor.dispose();
      return {
        leaf_detected: false,
        success: true,
        message: "No leaf detected",
        classes: [],
        error: null,
      };
    }

    // Run classification
    const classificationModel = modelLoader.getClassificationModel();
    let classificationResults: tf.Tensor;

    if (isGraphModel(classificationModel)) {
      // GraphModel approach
      classificationResults = classificationModel.execute(
        imageTensor
      ) as tf.Tensor;
    } else {
      // LayersModel approach
      classificationResults = classificationModel.predict(
        imageTensor
      ) as tf.Tensor;
    }

    // Get probabilities
    const logits = (await classificationResults.arraySync()) as number[][];
    classificationResults.dispose();
    imageTensor.dispose();

    // Process the logits - this may vary depending on model output format
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

    return {
      leaf_detected: true,
      success: true,
      message: "Leaf detected and classified successfully",
      classes,
      error: null,
    };
  } catch (error) {
    console.error("Error in inference:", error);
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
