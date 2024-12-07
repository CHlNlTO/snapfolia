"use client";

import FileDropzone from "@/components/component/fileDropzone";
import { MarqueeDemo } from "@/components/component/MarqueeDemo";
import { Button } from "@/components/ui/button";
import { useUserGuide } from "@/contexts/UserGuideContext";
import { motion } from "framer-motion";

export default function Home() {
  const { setIsOpen } = useUserGuide();
  return (
    <main className="relative mx-auto flex flex-col items-center overflow-hidden space-y-20">
      <section className="flex flex-col-reverse lg:flex-row items-center justify-center gap-0 lg:gap-28 mt-2 lg:mt-20 ">
        <FileDropzone />
        <div className="px-6 sm:px-0">
          <motion.h1
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black mt-20 lg:mt-10 text-green-900 max-w-[28rem] text-center lg:text-left"
          >
            Discover The Trees Of Batangas
          </motion.h1>
          <motion.h3
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-md sm:text-2xl font-semibold mt-4 lg:mt-6 text-green-800/70 opacity-75 text-center lg:text-left"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="hover:ring-2 hover:ring-green-600 hover:ring-offset-2 hover:ring-offset-white hover:decoration-clone hover:no-underline text-white"
            >
              Let&apos;s explore! Check the guide ⟶
            </Button>
          </motion.h3>
        </div>
      </section>
      <section className="overflow-hidden">
        <MarqueeDemo />
      </section>
    </main>
  );
}
