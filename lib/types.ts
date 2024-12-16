export interface LeafScanResult {
  leaf_detected: boolean;
  confidence?: number;
  species?: string;
  additional_info?: string;
  success: boolean;
  message: string;
}

export interface FileState {
  file: FileWithPreview | null;
  isScanning: boolean;
  setFile: (file: FileWithPreview | null) => void;
  setIsScanning: (isScanning: boolean) => void;
  handleScan: () => Promise<void>;
  clearFile: () => void;
}

export interface FileUploadState {
  file: FileWithPreview | null;
  setFile: (file: FileWithPreview | null) => void;
  clearFile: () => void;
}

export interface FileWithPreview extends File {
  preview: string;
}

export interface ScanResult {
  confidence?: number;
  label?: string;
  leaf_detected: boolean;
}

export interface FileState {
  file: FileWithPreview | null;
  isScanning: boolean;
  scanResult: ScanResult | null | undefined;
  setFile: (file: FileWithPreview | null) => void;
  setIsScanning: (isScanning: boolean) => void;
  setScanResult: (result: ScanResult | null) => void;
  handleScan: () => Promise<void>;
  clearFile: () => void;
  resetScan: () => void;
}
