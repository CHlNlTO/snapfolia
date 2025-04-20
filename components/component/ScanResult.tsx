import React, { useState } from "react";
import { LeafScanResult } from "@/lib/types";
import { AlertCircle, Leaf, Clock } from "lucide-react";
import { LeafResultCard } from "./LeafResultCard";
import LeafModal from "./LeafModal";
import { leaves } from "@/lib/data";
import { motion } from "framer-motion";

interface ScanResultProps {
  scanResult: LeafScanResult | null | undefined;
  isScanning: boolean;
  error?: string | null;
}

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full max-w-[350px] w-full">
    <div className="bg-red-50/50 p-8 rounded-xl backdrop-blur-sm w-full flex flex-col items-center justify-center">
      <div className="flex flex-row justify-center items-center gap-2 text-red-600">
        <AlertCircle className="h-6 w-6" />
        <h1 className="font-bold text-xl text-center">Error</h1>
      </div>
      <p className="text-gray-600 text-sm text-center mt-2">{message}</p>
    </div>
  </div>
);

const InitialState = () => (
  <div className="flex flex-col items-center justify-center h-full"></div>
);

const NoLeafDetected = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="bg-red-50/50 p-8 rounded-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="h-6 w-6" />
        <h1 className="font-bold text-xl">No leaf detected</h1>
      </div>
      <p className="text-gray-600 text-sm text-center mt-2 block">
        Upload a clear image of a leaf
      </p>
    </div>
  </div>
);

export const ScanResult: React.FC<ScanResultProps> = ({
  scanResult,
  isScanning,
  error,
}) => {
  const [selectedLeaf, setSelectedLeaf] = useState<string | null>(null);

  const leafData = selectedLeaf
    ? leaves.find(
        (leaf) => leaf.name.toLowerCase() === selectedLeaf.toLowerCase()
      )
    : null;

  if (error) return <ErrorDisplay message={error} />;
  if (scanResult && !scanResult.success)
    return <ErrorDisplay message={scanResult.message} />;
  if (isScanning) return null;
  if (!scanResult) return <InitialState />;
  if (!scanResult.leaf_detected || !scanResult.classes?.length)
    return <NoLeafDetected />;

  // Format scan time if available
  const formattedScanTime = scanResult.scanTime 
    ? `${(scanResult.scanTime / 1000).toFixed(2)}s`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 overflow-auto max-w-[594px]"
    >
      {/* Header */}
      <div className="text-center mb-8 w-full">
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center justify-center p-3 bg-emerald-600 rounded-2xl shadow-md mb-2">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">
            Results
          </h1>
        </div>
        <p className="text-emerald-600">
          Top {scanResult.classes.length} matches for your leaf
        </p>
      </div>

      {/* Results */}
      <div className="space-y-4 w-full ">
        {scanResult.classes.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LeafResultCard
              result={result}
              onClick={() => setSelectedLeaf(result.class)}
              rank={index + 1}
            />
          </motion.div>
        ))}
      </div>

      {/* Scan Time Display */}
      {formattedScanTime && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 py-2 px-4 rounded-md shadow-sm"
        >
          <Clock className="w-4 h-4" />
          <span className="font-medium">Scan Time: {formattedScanTime}</span>
        </motion.div>
      )}

      {leafData && (
        <LeafModal
          leaf={leafData}
          show={!!selectedLeaf}
          onHide={() => setSelectedLeaf(null)}
        />
      )}
    </motion.div>
  );
};

export default ScanResult;