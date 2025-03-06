// services/modelLoader.ts
import * as tf from "@tensorflow/tfjs";

const CLASSIFICATION_MODEL_URL =
  "https://uiffmgyykbhewphigjsf.supabase.co/storage/v1/object/public/snapfolia/classification_web_model/model.json";
const DETECTION_MODEL_URL =
  "https://uiffmgyykbhewphigjsf.supabase.co/storage/v1/object/public/snapfolia/object_detection_web_model/model.json";

class ModelLoader {
  private classificationModel: tf.GraphModel | tf.LayersModel | null = null;
  private detectionModel: tf.GraphModel | tf.LayersModel | null = null;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;

  // Singleton pattern
  private static instance: ModelLoader;
  public static getInstance(): ModelLoader {
    if (!ModelLoader.instance) {
      ModelLoader.instance = new ModelLoader();
    }
    return ModelLoader.instance;
  }

  constructor() {
    // Initialize TensorFlow.js
    tf.ready().then(() => {
      console.log("TensorFlow.js is ready");
    });
  }

  async loadModels(): Promise<void> {
    if (this.isLoading) {
      return this.loadPromise!;
    }

    if (this.classificationModel && this.detectionModel) {
      return Promise.resolve();
    }

    this.isLoading = true;
    this.loadPromise = new Promise<void>(async (resolve, reject) => {
      try {
        console.log("Loading models...");

        // Try to load models, attempt different methods if one fails
        try {
          // First attempt: Load as GraphModels (frozen models)
          const [classificationModel, detectionModel] = await Promise.all([
            tf.loadGraphModel(CLASSIFICATION_MODEL_URL),
            tf.loadGraphModel(DETECTION_MODEL_URL),
          ]);

          this.classificationModel = classificationModel;
          this.detectionModel = detectionModel;
          console.log("Models loaded successfully as GraphModels");
        } catch (error) {
          console.warn(
            "Failed to load as GraphModels, trying LayersModel format:",
            error
          );

          // Second attempt: Try loading as LayersModels (Keras models)
          const [classificationModel, detectionModel] = await Promise.all([
            tf.loadLayersModel(CLASSIFICATION_MODEL_URL),
            tf.loadLayersModel(DETECTION_MODEL_URL),
          ]);

          this.classificationModel = classificationModel;
          this.detectionModel = detectionModel;
          console.log("Models loaded successfully as LayersModels");
        }

        this.isLoading = false;
        resolve();
      } catch (error) {
        console.error("Error loading models:", error);
        this.isLoading = false;
        reject(error);
      }
    });

    return this.loadPromise;
  }

  getClassificationModel(): tf.GraphModel | tf.LayersModel {
    if (!this.classificationModel) {
      throw new Error("Classification model not loaded");
    }
    return this.classificationModel;
  }

  getDetectionModel(): tf.GraphModel | tf.LayersModel {
    if (!this.detectionModel) {
      throw new Error("Detection model not loaded");
    }
    return this.detectionModel;
  }

  areModelsLoaded(): boolean {
    return !!this.classificationModel && !!this.detectionModel;
  }
}

export default ModelLoader;
