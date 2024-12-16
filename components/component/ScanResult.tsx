"use client";

import React from "react";
import { LeafScanResult } from "@/lib/types";
import { getLeafDetails } from "@/utils/leaf-utils";
import { AlertCircle } from "lucide-react";

interface ScanResultProps {
  scanResult: LeafScanResult | null | undefined;
  isScanning: boolean;
  error?: string | null;
}

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="space-y-3 flex flex-col items-center justify-center">
    <div className="space-y-1 flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <h1 className="font-bold text-xl">Server Error</h1>
      </div>
      <p className="text-gray-600 text-sm text-center truncate">{message}</p>
      <p className="text-gray-600 text-sm text-center">
        Contact support or try again later.
      </p>
    </div>
  </div>
);

const InitialState = () => (
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

const NoLeafDetected = () => (
  <div className="space-y-3 flex flex-col items-center justify-center">
    <div className="space-y-1 flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <h1 className="font-bold text-xl">No leaf detected</h1>
      </div>
      <p className="text-gray-600 text-sm text-center">
        Please upload a clear image of a leaf
      </p>
    </div>
  </div>
);

const LeafResult = ({
  label,
  confidence,
}: {
  label: string;
  confidence: number;
}) => {
  const { englishName, scientificName } = getLeafDetails(label);

  return (
    <div className="space-y-3 flex flex-col items-center justify-center">
      <div className="space-y-1 flex flex-col items-center justify-center">
        <h1 className="text-green-900">
          <span className="font-bold text-3xl">{label}</span>
        </h1>
        <h3 className="text-green-900">
          <span className="font-normal text-lg">{englishName}</span>
        </h3>
        <h3 className="text-green-900">
          <span className="font-normal text-lg italic">{scientificName}</span>
        </h3>
        <h3 className="text-green-900">
          <span className="font-normal text-lg">
            {(confidence * 100).toFixed(1)}%
          </span>
        </h3>
      </div>
    </div>
  );
};

export const ScanResult: React.FC<ScanResultProps> = ({
  scanResult,
  isScanning,
  error,
}) => {
  // First check for explicit error prop
  if (error) {
    return <ErrorDisplay message={error} />;
  }

  // Then check for scan result with success: false
  if (scanResult && !scanResult.success) {
    return <ErrorDisplay message={scanResult.message} />;
  }

  // Return null during scanning
  if (isScanning) {
    return null;
  }

  if (!scanResult) {
    return <InitialState />;
  }

  if (!scanResult.leaf_detected || !scanResult.label) {
    return <NoLeafDetected />;
  }

  return (
    <LeafResult
      label={scanResult.label}
      confidence={scanResult.confidence ?? 0}
    />
  );
};

export default ScanResult;
