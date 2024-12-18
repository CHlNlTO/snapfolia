"use client";

import React from "react";
// import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  // DialogHeader,
  // DialogTitle,
} from "@/components/ui/dialog";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useUserGuide } from "@/contexts/UserGuideContext";
// import { motion } from "framer-motion";
// import { instructions } from "@/lib/data";
import UserGuide from "./UserGuide";
import { GradientBackground } from "./GradientBackground";

const UserGuideModal = () => {
  const { isOpen, setIsOpen } = useUserGuide();

  // useEffect(() => {
  //   const hasSeenGuide = localStorage.getItem("hasSeenGuide");
  //   if (!hasSeenGuide) {
  //     setIsOpen(true);
  //     localStorage.setItem("hasSeenGuide", "true");
  //   }
  // }, [setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden md:mx-0">
        <GradientBackground />
        <DialogTitle></DialogTitle>
        <UserGuide backgroundColor="bg-white/0" maxHeight="max-h-[450px]" />
        {/* <div className="relative">
          <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-lg sm:top-[-20rem]">
            <motion.div
              className="relative right-[75%] -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80f0ff] to-[#89fc9c] opacity-30 sm:left-[calc(75%-40rem)] sm:w-[72.1875rem]"
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
                rotate: [30, 60, 30],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-900">
            User Guide
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Carousel className="w-full">
            <CarouselContent>
              {instructions.guideSteps.map((step, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="flex flex-col items-center space-y-2 sm:space-y-4 w-full">
                      <div className="h-[180px] sm:h-[300px] w-full">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={600}
                          height={400}
                          className="rounded-lg object-contain w-full h-full"
                        />
                      </div>
                      <h3 className="text-md sm:text-xl font-semibold">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-lg text-center text-gray-600">
                        {step.content}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-12 hover:ring-2 hover:ring-green-600 hover:ring-offset-2 hover:ring-offset-white text-green-600 hover:text-green-500" />
            <CarouselNext className="mr-12 hover:ring-2 hover:ring-green-600 hover:ring-offset-2 hover:ring-offset-white text-green-600 hover:text-green-500" />
          </Carousel>
        </div> */}

        <div className="flex justify-end">
          <Button
            variant="default"
            onClick={() => setIsOpen(false)}
            className="mt-4 hover:ring-2 hover:ring-green-600 hover:ring-offset-2 hover:ring-offset-white bg-gradient-to-r from-green-500 to-green-600 border border-1 border-green-300 ring-1 ring-green-300"
          >
            Close Guide
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserGuideModal;
