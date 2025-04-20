// export interface LeafScanResult {
//   leaf_detected: boolean;
//   confidence?: number;
//   label?: string;
//   additional_info?: string;
//   success: boolean;
//   message: string;
// }

import { ScanError } from "./errors";

export interface LeafClass {
  class: string;
  confidence: number;
}

export interface LeafScanResult {
  leaf_detected: boolean;
  classes?: LeafClass[];
  success: boolean;
  message: string;
  error: ScanError | null;
  scanTime?: number; // Added scan time in milliseconds
}

export interface FileState {
  file: FileWithPreview | null;
  isScanning: boolean;
  scanResult: LeafScanResult | null | undefined;
  setFile: (file: FileWithPreview | null) => void;
  setIsScanning: (isScanning: boolean) => void;
  setScanResult: (result: LeafScanResult | null) => void;
  handleScan: () => Promise<void>;
  clearFile: () => void;
  resetScan: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export interface FileUploadState {
  file: FileWithPreview | null;
  setFile: (file: FileWithPreview | null) => void;
  clearFile: () => void;
}

export interface FileWithPreview extends File {
  preview: string;
}

// export interface ScanResult {
//   confidence?: number;
//   label?: string;
//   leaf_detected: boolean;
// }

export interface FileState {
  file: FileWithPreview | null;
  isScanning: boolean;
  scanResult: LeafScanResult | null | undefined;
  setFile: (file: FileWithPreview | null) => void;
  setIsScanning: (isScanning: boolean) => void;
  setScanResult: (result: LeafScanResult | null) => void;
  handleScan: () => Promise<void>;
  clearFile: () => void;
  resetScan: () => void;
}

export interface Leaf {
  id: number;
  name: string;
  englishName: string;
  scientificName: string;
  image: string;
  treeImage: string;
  generalInfo: string;
  botany: string;
  distribution: string[];
  reference: string;
  uses: string[];
  folklore: string;
  description: string;
  shortDescription: string;
  location: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Developer {
  image: string;
  firstName: string;
  lastName: string;
  role: string;
  socials?: SocialLinks;
}

export interface StepCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}
