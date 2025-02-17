"use client";

import { FileUpload } from "@/components/component/FileUpload";
import UserGuide from "@/components/component/UserGuide";
import { ScanProgress } from "@/components/component/ScanProgress";
import { ScanResult } from "@/components/component/ScanResult";
import { useFileStore } from "@/store/useFileStore";
import { externalLinks } from "@/lib/data";
import { Send } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { file, isScanning, scanResult, error } = useFileStore();

  const showScanResults =
    scanResult?.success &&
    scanResult?.leaf_detected &&
    (scanResult?.classes ?? []).length > 0;

  return (
    <main className="relative mx-auto mt-20 lg:mt-10 flex flex-col items-center overflow-hidden space-y-20 min-h-screen my-4 w-full">
      <section className="flex flex-col lg:grid grid-cols-2 items-center gap-0 lg:gap-20 lg:items-start justify-center mt-2 lg:mt-20 w-full">
        <div className="flex flex-col items-end justify-center space-y-4 mr-0 lg:mr-20">
          <div className="flex flex-col items-center space-y-4 justify-center w-full max-w-[400px]">
            <div className="flex flex-col items-center lg:items-end justify-center text-center">
              <FileUpload />
            </div>
            <ScanProgress
              isScanning={isScanning}
              file={file}
              messageStyle="casual"
            />
            <div className="w-full max-w-[300px]">
              {!showScanResults && (
                <ScanResult
                  scanResult={scanResult}
                  isScanning={isScanning}
                  error={error}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center lg:items-start justify-center w-full max-w-[800px] mt-5">
          {showScanResults ? (
            <ScanResult
              scanResult={scanResult}
              isScanning={isScanning}
              error={error}
            />
          ) : (
            <UserGuide />
          )}
        </div>
      </section>
      <Link
        className="hidden sm:flex fixed bottom-4 right-4 bg-green-600 text-white text-sm font-extrabold items-center justify-center gap-2 py-2 px-3 rounded-sm"
        href={externalLinks.userFeedback.url}
        target="_blank"
      >
        <Send className="w-4 h-4 text-white" />
        Got feedback?
      </Link>
    </main>
  );
}
