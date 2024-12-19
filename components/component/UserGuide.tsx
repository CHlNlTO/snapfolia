import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card } from "@/components/ui/card";
import { Leaf, Upload, Scan, RotateCcw, Eye } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { images } from "@/lib/data";
import { StepCardProps } from "@/lib/types";

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

export default function UserGuide() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });

  const [activeIndex, setActiveIndex] = React.useState(0);

  const [lastInteractionTime, setLastInteractionTime] = React.useState(
    Date.now()
  );

  useEffect(() => {
    if (emblaApi) {
      // Update active index on scroll
      const onSelectHandler = () => {
        setActiveIndex(emblaApi.selectedScrollSnap());
        setLastInteractionTime(Date.now());
      };

      // Track user interactions
      const handleInteraction = () => {
        setLastInteractionTime(Date.now());
      };

      // Set up auto-scroll check every 5 seconds
      const interval = setInterval(() => {
        const timeSinceLastInteraction = Date.now() - lastInteractionTime;
        // Only auto-scroll if user hasn't interacted in last 10 seconds
        if (timeSinceLastInteraction > 10000) {
          emblaApi.scrollNext();
        }
      }, 5000);

      // Add event listeners
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
  }, [emblaApi, lastInteractionTime]);

  return (
    <div className="w-full max-h-[80vh] overflow-auto bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6">
      {/* Compact Header */}
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

      {/* Main Carousel */}
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

        {/* Mobile Scroll Indicators */}
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

        {/* Navigation Arrows - Visible on all devices */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
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
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
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
    </div>
  );
}
