import { LeafScanResult } from "./types";

// Define specific error types
export enum ScanErrorType {
  NETWORK = "NETWORK",
  SERVER = "SERVER",
  VALIDATION = "VALIDATION",
  UNKNOWN = "UNKNOWN",
}

export interface ScanError {
  type: ScanErrorType;
  message: string;
  details?: string;
}

// Error response factory
export const createErrorResponse = (error: ScanError): LeafScanResult => ({
  success: false,
  leaf_detected: false,
  message: error.message,
  error: {
    type: error.type,
    details: error.details,
    message: error.message,
  },
});

// Predefined error messages
export const SCAN_ERRORS = {
  [ScanErrorType.NETWORK]: {
    OFFLINE: {
      type: ScanErrorType.NETWORK,
      message: "No internet connection detected",
      details: "Please check your network connection and try again",
    },
    TIMEOUT: {
      type: ScanErrorType.NETWORK,
      message: "Slow network connection. Please try again.",
      details: "Request timed out.",
    },
  },
  [ScanErrorType.SERVER]: {
    UNAVAILABLE: {
      type: ScanErrorType.SERVER,
      message: "Server is offline. Contact Support.",
      details: "Our servers are currently down. Please try again later",
    },
    MAINTENANCE: {
      type: ScanErrorType.SERVER,
      message: "System maintenance",
      details: "Server is undergoing maintenance. Please try again later",
    },
    OVERLOADED: {
      type: ScanErrorType.SERVER,
      message: "Server busy",
      details: "Too many requests. Please try again in a few minutes",
    },
    NOTFOUND: {
      type: ScanErrorType.SERVER,
      message: "Server is offline. Contact support.",
      details: "Too many requests. Please try again in a few minutes",
    },
  },
  [ScanErrorType.VALIDATION]: {
    NO_FILE: {
      type: ScanErrorType.VALIDATION,
      message: "No image selected",
      details: "Please select an image file",
    },
    INVALID_TYPE: {
      type: ScanErrorType.VALIDATION,
      message: "Invalid file type",
      details: "Please upload an image file (JPG, PNG, etc.)",
    },
    FILE_TOO_LARGE: {
      type: ScanErrorType.VALIDATION,
      message: "File too large",
      details: "Please upload an image smaller than 5MB",
    },
  },
};
