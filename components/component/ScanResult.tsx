"use client";

import React from "react";
import { ScanResult as ScanResultType } from "@/lib/types";

interface ScanResultProps {
  scanResult: ScanResultType | null | undefined;
  isScanning: boolean;
}

export const ScanResult: React.FC<ScanResultProps> = ({
  scanResult,
  isScanning,
}) => {
  // If no scan has been performed yet (initial state)
  if (!scanResult && !isScanning) {
    return (
      <div className="space-y-3 flex flex-col items-center justify-center">
        <div className="space-y-1 flex flex-col items-center justify-center">
          <h1 className="text-green-900">
            <span className="font-bold text-3xl">Filipino Name</span>
          </h1>
          <h3 className="text-green-900">
            <span className="font-normal text-lg">English Name</span>
          </h3>
          <h3 className="text-green-900">
            <span className="font-normal text-lg italic">Scientific Name</span>
          </h3>
          <h3 className="text-green-900">
            <span className="font-normal text-lg">Probability</span>
          </h3>
        </div>
      </div>
    );
  }

  // If scan has completed and we have results
  if (scanResult && !isScanning) {
    if (scanResult.leaf_detected && scanResult.label) {
      return (
        <div className="space-y-3 flex flex-col items-center justify-center">
          <div className="space-y-1 flex flex-col items-center justify-center">
            <h1 className="text-green-900">
              <span className="font-bold text-3xl">{scanResult.label}</span>
            </h1>
            <h3 className="text-green-900">
              <span className="font-normal text-lg">English Name</span>
            </h3>
            <h3 className="text-green-900">
              <span className="font-normal text-lg italic">
                Scientific Name
              </span>
            </h3>
            <h3 className="text-green-900">
              <span className="font-normal text-lg">
                {((scanResult.confidence ?? 0) * 100).toFixed(1)}%
              </span>
            </h3>
          </div>
        </div>
      );
    } else {
      // If scan completed but no leaf was detected
      return (
        <div className="space-y-3 flex flex-col items-center justify-center">
          <div className="space-y-1 flex flex-col items-center justify-center">
            <h1 className="text-red-600">
              <span className="font-bold text-xl">No leaf detected</span>
            </h1>
            <p className="text-gray-600 text-sm">
              Please upload a clear image of a leaf
            </p>
          </div>
        </div>
      );
    }
  }

  // Don't render anything while scanning (progress bar will be shown instead)
  return null;
};
