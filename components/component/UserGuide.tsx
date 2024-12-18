"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { Leaf, Upload, Scan, RotateCcw } from "lucide-react";
import { Carousel } from "react-bootstrap";
import guidePreferred from "@/app/assets/img/guide-preferred.png";
import guidePreferred1 from "@/app/assets/img/guide-preferred-1.png";
import guidePreferred2 from "@/app/assets/img/guide-preferred-2.png";
import guidePreferred3 from "@/app/assets/img/guide-preferred-3.png";
import guideAvoid from "@/app/assets/img/guide-avoid.png";
import guideAvoid1 from "@/app/assets/img/guide-avoid-1.png";
import guideAvoid2 from "@/app/assets/img/guide-avoid-2.png";
import guideAvoid3 from "@/app/assets/img/guide-avoid-3.png";
import guideProgress from "@/app/assets/img/guide-progress.png";
import guideProgressMobile from "@/app/assets/img/guide-progress-mobile.png";

interface UserGuideProps {
  backgroundColor?: string;

  maxHeight?: string;
}

// Types
type ImageStep = {
  src: StaticImageData;
  caption: string;
};

type ImagesConfig = {
  preferred: {
    desktop: StaticImageData;
    steps: ImageStep[];
  };
  avoid: {
    desktop: StaticImageData;
    steps: ImageStep[];
  };
  progress: {
    desktop: StaticImageData;
    mobile: StaticImageData;
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

// Import all images using require to ensure proper loading
const images: ImagesConfig = {
  preferred: {
    desktop: guidePreferred,
    steps: [
      { src: guidePreferred1, caption: "Subject is centered" },
      { src: guidePreferred2, caption: "Subject is properly lit" },
      { src: guidePreferred3, caption: "Subject is clear" },
    ],
  },
  avoid: {
    desktop: guideAvoid,
    steps: [
      { src: guideAvoid1, caption: "Subject is blurred" },
      { src: guideAvoid2, caption: "Contains other elements" },
      { src: guideAvoid3, caption: "Contains other elements" },
    ],
  },
  progress: {
    desktop: guideProgress,
    mobile: guideProgressMobile,
  },
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, className }) => (
  <Carousel
    className={`mx-auto w-full md:w-3/4 mb-6 shadow-lg rounded-xl ${className}`}
    controls={false}
  >
    {images.map((image, index) => (
      <Carousel.Item key={index} className="relative">
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
      </Carousel.Item>
    ))}
  </Carousel>
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
    <div className="">{children}</div>
  </div>
);

export default function UserGuide({
  backgroundColor,
  maxHeight,
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
              <span>Tap the &apos;Upload an image&apos; button</span>
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

            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="flex items-center gap-2 text-amber-800">
                <span className="font-semibold">Note:</span>
                This app is limited to classifying trees only
              </p>
            </div>
          </div>
        </StepCard>

        <StepCard number="2" title="Scan Your Leaf">
          <div className="flex items-center gap-2 text-emerald-700">
            <Scan className="w-5 h-5" />
            <span>
              Click the &apos;Scan leaf&apos; button to begin processing
            </span>
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
              Use the &apos;Remove&apos; button to clear your results and scan
              another leaf
            </span>
          </div>
        </StepCard>
      </div>
    </div>
  );
}
