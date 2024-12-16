"use client";

import { FileUpload } from "@/components/component/FileUpload";
import UserGuide from "@/components/component/UserGuide";
import { ScanProgress } from "@/components/component/ScanProgress";
import { ScanResult } from "@/components/component/ScanResult";
import { useFileStore } from "@/store/useFileStore";

export default function Home() {
  const { file, isScanning, scanResult, error } = useFileStore();

  return (
    <main className="relative mx-auto mt-20 lg:mt-10 flex flex-col items-center overflow-hidden space-y-20 min-h-screen my-4">
      <section className="flex flex-col lg:grid grid-cols-2 items-center lg:items-start justify-center mt-2 lg:mt-20 gap-20 lg:gap-0 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <FileUpload />
          <ScanProgress
            isScanning={isScanning}
            file={file}
            messageStyle="casual" // You can change this to "formal" or "scientific"
          />
          <ScanResult
            scanResult={scanResult}
            isScanning={isScanning}
            error={error}
          />
        </div>
        <div
          className="flex flex-col items-start justify-center w-full max-w-[800px]"
          style={{ marginTop: "20px" }}
        >
          <UserGuide
            backgroundColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
            maxHeight="max-h-[700px]"
          />
        </div>
      </section>
    </main>
  );
}
