"use client";

import { FileUpload } from "@/components/component/FileUpload";
import UserGuide from "@/components/component/UserGuide";
import { Progress } from "@/components/ui/progress";
import { useFileStore } from "@/store/useFileStore";

export default function Home() {
  const { file, isScanning, scanResult } = useFileStore();
  return (
    <main className="relative mx-auto mt-20 xl:mt-0 flex flex-col items-center overflow-hidden space-y-20 min-h-screen my-4">
      <section className="flex flex-col lg:grid grid-cols-2 items-center justify-center mt-2 lg:mt-20 space-y-16 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <FileUpload />
          {file && isScanning && (
            <Progress className="w-[245px] h-3 mt-2" value={50} />
          )}
          {scanResult?.leaf_detected === true ? (
            <div className="space-y-3 flex flex-col items-center justify-center">
              <div className="space-y-1 flex flex-col items-center justify-center">
                <h1 className="text-green-900">
                  <span className="font-bold text-3xl">
                    {scanResult?.label}
                  </span>
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
                    {((scanResult?.confidence ?? 0) * 100).toFixed(1)}%
                  </span>
                </h3>
              </div>
            </div>
          ) : (
            <div className="space-y-3 flex flex-col items-center justify-center">
              <div className="space-y-1 flex flex-col items-center justify-center">
                <h1 className="text-green-900">
                  <span className="font-bold text-3xl">Filipino Name</span>
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
                  <span className="font-normal text-lg">Probability</span>
                </h3>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center mt-0 w-full max-w-[800px]">
          <UserGuide />
        </div>
      </section>
      {/* <section className="overflow-hidden">
        <MarqueeDemo />
      </section> */}
    </main>
  );
}
