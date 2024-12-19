"use client";

import React from "react";
import Image from "next/image";
import { Leaf, Upload, Scan, RotateCcw, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

interface UserGuideProps {
  backgroundColor?: string;
  maxHeight?: string;
}

// Types
type ImageStep = {
  src: string;
  caption: string;
};

type ImagesConfig = {
  preferred: {
    desktop: string;
    steps: ImageStep[];
  };
  avoid: {
    desktop: string;
    steps: ImageStep[];
  };
  progress: {
    desktop: string;
    mobile: string;
  };
};

type ImageCarouselProps = {
  images: ImageStep[];
  className?: string;
};

type StepCardProps = {
  number: string;
  title: string;
  children: React.ReactNode;
};

// Define images with proper public directory paths
const images: ImagesConfig = {
  preferred: {
    desktop: "/assets/img/guide-preferred.png",
    steps: [
      {
        src: "/assets/img/guide-preferred-1.png",
        caption: "Subject is centered",
      },
      {
        src: "/assets/img/guide-preferred-2.png",
        caption: "Subject is properly lit",
      },
      {
        src: "/assets/img/guide-preferred-3.png",
        caption: "Subject is clear",
      },
    ],
  },
  avoid: {
    desktop: "/assets/img/guide-avoid.png",
    steps: [
      {
        src: "/assets/img/guide-avoid-1.png",
        caption: "Subject is blurred",
      },
      {
        src: "/assets/img/guide-avoid-2.png",
        caption: "Contains other elements",
      },
      {
        src: "/assets/img/guide-avoid-3.png",
        caption: "Contains other elements",
      },
    ],
  },
  progress: {
    desktop: "/assets/img/guide-progress.png",
    mobile: "/assets/img/guide-progress-mobile.png",
  },
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, className }) => (
  <div
    className={`mx-auto w-full md:w-3/4 mb-6 shadow-lg rounded-xl ${className}`}
  >
    <div className="relative">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <Image
            className="w-full rounded-xl"
            src={image.src}
            width={500}
            height={750}
            alt={image.caption}
            priority
          />
          <div className="absolute top-0 left-0 right-0 bg-emerald-700 p-4 rounded-t-xl">
            <p className="text-white font-medium text-sm md:text-base">
              {image.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StepCard: React.FC<StepCardProps> = ({ number, title, children }) => (
  <div className="bg-emerald-50 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-6">
    <div className="flex items-start gap-4 mb-4">
      <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-emerald-800">
        {title}
      </h3>
    </div>
    <div>{children}</div>
  </div>
);

export default function UserGuide({
  backgroundColor = "bg-white",
  maxHeight = "max-h-screen",
}: UserGuideProps) {
  return (
    <div
      className={`${backgroundColor} p-4 md:p-8 ${maxHeight} overflow-auto rounded-lg mx-4 lg:mx-4`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-600 rounded-full shadow-md mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-2">
              User Guide
            </h1>
          </div>
          <p className="text-emerald-600">
            Follow these steps to identify your tree
          </p>
        </div>

        {/* Steps */}
        <StepCard number="1" title="Upload Your Image">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Upload className="w-5 h-5" />
              <span>Tap the Upload an image button</span>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-emerald-800 mb-2">
                Recommended Format:
              </h4>
              <Image
                className="hidden md:block mx-auto rounded-lg shadow-md"
                src={images.preferred.desktop}
                width={500}
                height={750}
                alt="Preferred format example"
                priority
              />
              <ImageCarousel
                images={images.preferred.steps}
                className="md:hidden"
              />
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Avoid These:</h4>
              <Image
                className="hidden md:block mx-auto rounded-lg shadow-md"
                src={images.avoid.desktop}
                width={500}
                height={750}
                alt="Examples to avoid"
                priority
              />
              <ImageCarousel
                images={images.avoid.steps}
                className="md:hidden"
              />
            </div>
          </div>
        </StepCard>

        <StepCard number="2" title="Scan Your Leaf">
          <div className="flex items-center gap-2 text-emerald-700">
            <Scan className="w-5 h-5" />
            <span>Click the Scan leaf button to begin processing</span>
          </div>
        </StepCard>

        <StepCard number="3" title="Track Progress">
          <div className="space-y-4">
            <p className="text-emerald-700">
              Monitor your scan progress using the progress bar
            </p>
            <div className="bg-white p-4 rounded-lg shadow-inner">
              <Image
                className="hidden md:block mx-auto rounded-lg"
                src={images.progress.desktop}
                width={500}
                height={750}
                alt="Desktop progress tracking example"
                priority
              />
              <Image
                className="md:hidden w-3/4 mx-auto rounded-lg"
                src={images.progress.mobile}
                width={500}
                height={750}
                alt="Mobile progress tracking example"
                priority
              />
            </div>
          </div>
        </StepCard>

        <StepCard number="4" title="Scan Again">
          <div className="flex items-center gap-2 text-emerald-700">
            <RotateCcw className="w-5 h-5" />
            <span>
              Use the Scan Again button to clear your results and scan another
              leaf
            </span>
          </div>
        </StepCard>
      </div>
      {/* Compact Layout to maximize space usage */}
      <div className="h-full grid grid-cols-1 gap-4  lg:hidden">
        {/* Left Column - Steps */}
        <div className="col-span-5 space-y-2">
          {/* Compact Step Cards */}
          <Card className="p-3 bg-emerald-50/80">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-1">
                  <Upload className="w-4 h-4" />
                  Upload Image
                </h3>
                <p className="text-xs text-emerald-600 mt-1">
                  Tap &apos;Upload an image&apos; and select a clear photo of a
                  single leaf
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-emerald-50/80">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-1">
                  <Scan className="w-4 h-4" />
                  Scan Leaf
                </h3>
                <p className="text-xs text-emerald-600 mt-1">
                  Click &apos;Scan leaf&apos; to begin analysis
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-emerald-50/80">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  View Results
                </h3>
                <p className="text-xs text-emerald-600 mt-1">
                  Wait for results to appear below the image
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-emerald-50/80">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-800 flex items-center gap-1">
                  <RotateCcw className="w-4 h-4" />
                  Scan Again
                </h3>
                <p className="text-xs text-emerald-600 mt-1">
                  Use &apos;Scan Again&apos; to scan another leaf
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      ;
    </div>
  );
}
