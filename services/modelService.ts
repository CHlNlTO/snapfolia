// services/modelService.ts
import * as tf from "@tensorflow/tfjs";
import { LeafClass, LeafScanResult } from "@/lib/types";
import { ScanErrorType } from "@/lib/errors";

// Constants for model URLs
const MODEL_JSON_URL =
  "https://uiffmgyykbhewphigjsf.supabase.co/storage/v1/object/public/snapfolia/yolov8n-cls_web_model/model.json";
const CLASS_NAMES_URL = "/class_names.json";

class ModelService {
  private model: tf.GraphModel | null = null;
  private modelLoading: Promise<tf.GraphModel> | null = null;
  private isOnline: boolean = true;
  private classNames: Record<string, string> | null = null;

  constructor() {
    // Initialize online status
    if (typeof window !== "undefined") {
      this.isOnline = navigator.onLine;
      window.addEventListener("online", this.handleNetworkChange);
      window.addEventListener("offline", this.handleNetworkChange);
    }
  }

  private handleNetworkChange = () => {
    if (typeof window !== "undefined") {
      this.isOnline = navigator.onLine;
      console.log(`Network status changed. Online: ${this.isOnline}`);
    }
  };

  /**
   * Loads the TensorFlow.js model if not already loaded
   */
  async loadModel(): Promise<tf.GraphModel> {
    // Return existing model if already loaded
    if (this.model) {
      return this.model;
    }

    // Return the loading promise if already in progress
    if (this.modelLoading) {
      return this.modelLoading;
    }

    console.log("Loading TensorFlow.js model...");

    // Create new loading promise
    this.modelLoading = tf.loadGraphModel(MODEL_JSON_URL);

    try {
      this.model = await this.modelLoading;
      console.log("Model loaded successfully!");

      // Also load class names
      await this.loadClassNames();

      return this.model;
    } catch (error) {
      console.error("Failed to load model:", error);
      this.modelLoading = null;
      throw error;
    }
  }

  /**
   * Loads the class names mapping
   */
  private async loadClassNames(): Promise<void> {
    if (this.classNames) {
      return;
    }

    try {
      const response = await fetch(CLASS_NAMES_URL);
      if (!response.ok) {
        throw new Error(`Failed to load class names: ${response.statusText}`);
      }

      this.classNames = await response.json();
      console.log("Class names loaded successfully!", this.classNames);
    } catch (error) {
      console.error("Failed to load class names:", error);
      // Provide a fallback of the 40 class names from the YAML file
      this.classNames = {
        "0": "Balete",
        "1": "Bayabas",
        "2": "Dita",
        "3": "Ilang-Ilang",
        "4": "Langka",
        "5": "Mangga",
        "6": "Mahogany",
        "7": "Duhat",
        "8": "Palo-Maria",
        "9": "Narra",
        "10": "Yakal",
        "11": "Alibangbang",
        "12": "Apitong",
        "13": "Kamagong",
        "14": "Kalios",
        "15": "Acacia",
        "16": "Madre-Cacao",
        "17": "Eucalyptus",
        "18": "Scramble-Egg",
        "19": "Alagao",
        "20": "Sintores",
        "21": "Tibig",
        "22": "Amugis",
        "23": "Balayong",
        "24": "Bani",
        "25": "Banaba",
        "26": "Barako",
        "27": "Binunga",
        "28": "Betis",
        "29": "Dao",
        "30": "Asis",
        "31": "Lansones",
        "32": "Talisay",
        "33": "Guyabano",
        "34": "Ipil",
        "35": "Mulawin",
        "36": "Antipolo",
        "37": "Santol",
        "38": "Inyam",
        "39": "Hinadyong",
      };
    }
  }

  /**
   * Preprocesses an image for the model
   */
  private async preprocessImage(file: File): Promise<tf.Tensor> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Create a tensor from the image (resizing to input size expected by YOLOv8-cls)
          const tensor = tf.tidy(() => {
            // Convert image to tensor
            const imageTensor = tf.browser.fromPixels(img);

            // Resize to model input size (224x224 is common, but adjust based on your model)
            const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);

            // Normalize pixels [0, 255] -> [0, 1]
            const normalized = resized.div(tf.scalar(255));

            // Add batch dimension [224, 224, 3] -> [1, 224, 224, 3]
            return normalized.expandDims(0);
          });

          resolve(tensor);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = (error) => {
        reject(error);
      };

      // Set the image source to the file
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Performs leaf classification on an image using the local model
   */
  async classifyImage(file: File): Promise<LeafScanResult> {
    try {
      // Load the model if not already loaded
      const model = await this.loadModel();

      // Preprocess the image
      const tensor = await this.preprocessImage(file);

      // Perform inference
      const predictions = (await model.predict(tensor)) as tf.Tensor;

      // Cleanup the tensor to prevent memory leaks
      tensor.dispose();

      // Process the results
      const probabilities = await predictions.data();
      predictions.dispose(); // Clean up to prevent memory leaks

      console.log("Model output length:", probabilities.length);

      // Get expected number of classes (the array length could be more than our actual classes)
      const expectedClassCount = Object.keys(this.classNames || {}).length;
      console.log("Expected class count:", expectedClassCount);

      // Map the output probabilities to class indices
      let classPredictions: LeafClass[] = [];

      // Check if we have probabilities
      if (probabilities.length > 0) {
        // Only take the first 'expectedClassCount' probabilities
        // This is because some models may output more values than classes
        const relevantProbs = probabilities.slice(
          0,
          Math.min(probabilities.length, expectedClassCount)
        );

        // Create a map of probabilities with their indices
        const indexedProbs = Array.from(relevantProbs).map((prob, i) => ({
          prob,
          index: i,
        }));

        // Sort by probability (highest first)
        indexedProbs.sort((a, b) => b.prob - a.prob);

        // Get top 5 predictions (or fewer if we have less)
        classPredictions = indexedProbs
          .slice(0, Math.min(5, indexedProbs.length))
          .map(({ prob, index }) => {
            // Get proper class name using the mapping
            const className =
              this.classNames?.[index.toString()] || `Unknown_${index}`;
            return {
              class: className,
              confidence: prob * 100, // Convert to percentage
            };
          });

        console.log("Top predictions:", classPredictions);
      } else {
        console.warn("No probabilities returned from model");
      }

      // Only consider it a leaf if we have predictions and top confidence is above threshold
      const leafDetected =
        classPredictions.length > 0 && classPredictions[0].confidence > 30;

      return {
        success: true,
        leaf_detected: leafDetected,
        classes: classPredictions,
        message: leafDetected
          ? "Leaf successfully detected"
          : "No leaf detected with high confidence",
        error: null,
      };
    } catch (error) {
      console.error("Error during inference:", error);
      return {
        success: false,
        leaf_detected: false,
        classes: [],
        message: "Error processing image",
        error: {
          type: ScanErrorType.UNKNOWN,
          message: "Failed to process image with local model",
          details: error instanceof Error ? error.message : String(error),
        },
      };
    }
  }

  /**
   * Checks if internet connection is available
   */
  isNetworkAvailable(): boolean {
    return this.isOnline;
  }

  /**
   * Cleans up resources when the service is no longer needed
   */
  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }

    // Remove event listeners
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleNetworkChange);
      window.removeEventListener("offline", this.handleNetworkChange);
    }
  }
}

// Export singleton instance
export const modelService = new ModelService();
