import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Upload, Scan, RotateCcw, Eye } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { images } from "@/lib/data";
import { StepCardProps } from "@/lib/types";

interface UserGuideProps {
  onClose?: () => void;
  isModal?: boolean;
}

const StepCard = ({ icon: Icon, title, description }: StepCardProps) => (
  <Card className="p-4 bg-white/50 backdrop-blur border-none shadow-md">
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-emerald-100">
        <Icon className="w-5 h-5 text-emerald-600" />
      </div>
      <div>
        <h3 className="font-medium text-emerald-800">{title}</h3>
        <p className="text-sm text-emerald-600 mt-1">{description}</p>
      </div>
    </div>
  </Card>
);

const steps = [
  {
    icon: Upload,
    title: "Upload Your Image",
    description: "Take or upload a clear photo of a single leaf",
    content: (
      <div className="mt-4 space-y-4">
        <div className="bg-emerald-50 p-4 rounded-lg">
          <h4 className="font-medium text-emerald-800 mb-2">
            Recommended Format
          </h4>
          <Image
            src={images.preferred.desktop}
            alt="Recommended format"
            width={600}
            height={400}
            className="rounded-lg w-full object-cover"
          />
        </div>
      </div>
    ),
  },
  {
    icon: Eye,
    title: "What to Avoid",
    description: "Examples of improper image captures",
    content: (
      <div className="mt-4">
        <div className="bg-red-50 p-4 rounded-lg">
          <Image
            src={images.avoid.desktop}
            alt="Examples to avoid"
            width={600}
            height={400}
            className="rounded-lg w-full object-cover"
          />
        </div>
      </div>
    ),
  },
  {
    icon: Scan,
    title: "Scan Your Leaf",
    description: "Click 'Scan leaf' to begin the analysis process",
    content: (
      <div className="mt-4">
        <Image
          src={images.progress.desktop}
          alt="Scanning process"
          width={600}
          height={400}
          className="rounded-lg w-full object-cover"
        />
      </div>
    ),
  },
  {
    icon: RotateCcw,
    title: "Scan Again",
    description: "Use 'Scan Again' to analyze another leaf",
    content: (
      <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
        <p className="text-emerald-700 text-sm">
          You can scan as many leaves as you want. Simply click the &apos;Scan
          Again&apos; button to start over with a new leaf image.
        </p>
      </div>
    ),
  },
];

export default function UserGuide({
  onClose,
  isModal = false,
}: UserGuideProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    dragFree: false,
  });

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [lastInteractionTime, setLastInteractionTime] = React.useState(
    Date.now()
  );

  useEffect(() => {
    if (emblaApi) {
      const onSelectHandler = () => {
        const currentIndex = emblaApi.selectedScrollSnap();
        setActiveIndex(currentIndex);
        setLastInteractionTime(Date.now());

        // Reset to first slide if we reach the end and not in modal mode
        if (currentIndex === steps.length - 1 && !isModal) {
          setTimeout(() => emblaApi.scrollTo(0), 5000);
        }
      };

      const handleInteraction = () => {
        setLastInteractionTime(Date.now());
      };

      const interval = setInterval(() => {
        const timeSinceLastInteraction = Date.now() - lastInteractionTime;
        if (timeSinceLastInteraction > 10000) {
          emblaApi.scrollNext();
        }
      }, 5000);

      emblaApi.on("select", onSelectHandler);
      const rootNode = emblaApi.rootNode();
      rootNode.addEventListener("click", handleInteraction);
      rootNode.addEventListener("touchstart", handleInteraction);
      rootNode.addEventListener("mousemove", handleInteraction);

      return () => {
        clearInterval(interval);
        emblaApi.off("select", onSelectHandler);
        rootNode.removeEventListener("click", handleInteraction);
        rootNode.removeEventListener("touchstart", handleInteraction);
        rootNode.removeEventListener("mousemove", handleInteraction);
      };
    }
  }, [emblaApi, lastInteractionTime, isModal]);

  const isLastStep = activeIndex === steps.length - 1;
  const showCloseButton = isModal && isLastStep;

  return (
    <div className="w-full max-h-[80vh] overflow-auto bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6 px-4">
        <div className="p-2 bg-emerald-600 rounded-lg shadow-lg">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-emerald-800">User Guide</h1>
          <p className="text-sm text-emerald-600">
            Follow these steps to identify your tree
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {steps.map((step, index) => (
              <div
                className="flex-[0_0_100%] min-w-0 relative px-4"
                key={index}
              >
                <StepCard
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                />
                {step.content}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                activeIndex === index ? "bg-emerald-600 w-4" : "bg-emerald-200"
              )}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg",
            activeIndex === 0 ? "hidden" : ""
          )}
          aria-label="Previous slide"
        >
          <svg
            className="w-6 h-6 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className={cn(
            "absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg",
            isLastStep ? "hidden" : ""
          )}
          aria-label="Next slide"
        >
          <svg
            className="w-6 h-6 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Close button - only shown in modal and on last step */}
      {showCloseButton && (
        <div className="flex justify-end -mt-0">
          <Button
            variant="default"
            onClick={onClose}
            className="hover:ring-2 hover:ring-green-600 hover:ring-offset-2 hover:ring-offset-white bg-gradient-to-r from-green-500 to-green-600 border border-1 border-green-300 ring-1 ring-green-300"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
