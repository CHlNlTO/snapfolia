export interface FileWithPreview extends File {
  preview: string;
}

export interface LeafScanResult {
  leaf_detected: boolean;
  confidence?: number;
  species?: string;
  additional_info?: string;
}

export interface FileUploadState {
  file: FileWithPreview | null;
  setFile: (file: FileWithPreview | null) => void;
  clearFile: () => void;
}
