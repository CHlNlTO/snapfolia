import { create } from "zustand";
import { scanLeafImage } from "@/lib/api";
import { FileState, LeafScanResult } from "@/lib/types";

export const useFileStore = create<FileState>((set, get) => ({
  file: null,
  isScanning: false,
  scanResult: null,
  setFile: (file) => {
    // Revoke previous file preview if exists
    const currentFile = get().file;
    if (currentFile?.preview) {
      URL.revokeObjectURL(currentFile.preview);
    }
    set({ file });
    // Reset scan result when new file is uploaded
    set({ scanResult: null });
  },
  setIsScanning: (isScanning) => set({ isScanning }),
  setScanResult: (result: LeafScanResult | null) => set({ scanResult: result }),
  error: null,
  setError: (error) => set({ error }),
  handleScan: async () => {
    const { file, setIsScanning, setScanResult, setError } = get();
    console.log("Scanning leaf...");
    setScanResult(null);
    setIsScanning(true);
    setError(null);

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await scanLeafImage(formData);
        setScanResult(result);
        console.log("Scan result:", result);
      } catch (error) {
        console.error(error);
        setScanResult(null);
        setError("Failed to process the image. Please try again.");
      } finally {
        setIsScanning(false);
      }
    }
  },
  clearFile: () => {
    const { file } = get();
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    set({ file: null, scanResult: null, error: null });
  },
  resetScan: () => set({ scanResult: null, isScanning: false }),
}));
