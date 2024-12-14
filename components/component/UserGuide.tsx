"use client";

import React from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";
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

const UserGuide = () => {
  const getImageUrl = (imageName: string): string =>
    `/app/assets/img/${imageName}`;

  return (
    <div className="flex flex-row overflow-hidden p-4 animate-fade-in max-h-[600px] mx-4">
      <div className="w-full bg-gray-200/50 rounded-lg font-montserrat text-[#1e5434] overflow-auto p-4">
        <h1 className="text-3xl font-black text-center mb-4 flex flex-row gap 2 items-center justify-center">
          <Leaf className="inline-block mr-2 w-7 h-7" fill="#1e5434" />
          User Guide
        </h1>
        <hr className="border-[#1e5434]/50 mb-6" />

        <div className="flex flex-col items-center justify-center text-center">
          <ol className="space-y-4 px-6">
            <li>
              <p>
                Tap{" "}
                <span className="font-semibold">&#39;Take a photo&#39;</span> or{" "}
                <span className="font-semibold">&#39;Upload an image&#39;</span>{" "}
                button.
              </p>
              <ul className="pl-4 mt-2 space-y-2">
                <li>
                  Take/upload an image of a leaf, preferably following{" "}
                  <span className="font-semibold">this format</span>:
                </li>
              </ul>

              <Image
                className="hidden md:block mx-auto my-4 rounded-lg"
                src={guidePreferred}
                width={500}
                height={750}
                alt="Preferred"
              />

              <Carousel className="md:hidden mx-auto w-3/4 mb-4">
                <Carousel.Item>
                  <Image
                    className="w-full rounded-lg"
                    src={guidePreferred1}
                    width={500}
                    height={750}
                    alt="Center"
                  />
                  <Carousel.Caption>
                    <p className="font-semibold">Subject is centered</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <Image
                    className="w-full rounded-lg"
                    src={guidePreferred2}
                    width={500}
                    height={750}
                    alt="Properly lit"
                  />
                  <Carousel.Caption>
                    <p className="font-semibold">Subject is properly lit</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <Image
                    className="w-full rounded-lg"
                    src={guidePreferred3}
                    width={500}
                    height={750}
                    alt="Clear"
                  />
                  <Carousel.Caption>
                    <p className="font-semibold">Subject is clear</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>

              <ul className="pl-4 mt-2 space-y-2">
                <li>
                  Users should <span className="font-semibold">avoid</span>{" "}
                  taking image of the subject like ones below:
                </li>
              </ul>

              <Image
                className="hidden md:block mx-auto my-4 rounded-lg"
                src={guideAvoid}
                width={500}
                height={750}
                alt="Avoid"
              />

              <Carousel className="md:hidden mx-auto w-3/4 mb-4">
                <Carousel.Item>
                  <Image
                    className="w-full rounded-lg"
                    src={guideAvoid1}
                    width={500}
                    height={750}
                    alt="Blurred"
                  />
                  <Carousel.Caption>
                    <p className="font-semibold">Subject is blurred</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <Image
                    className="w-full rounded-lg"
                    src={guideAvoid2}
                    width={500}
                    height={750}
                    alt="Contains other elements"
                  />
                  <Carousel.Caption>
                    <p className="font-semibold">Contains other elements</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <Image
                    className="w-full rounded-lg"
                    src={guideAvoid3}
                    width={500}
                    height={750}
                    alt="Contains other elements"
                  />
                  <Carousel.Caption>
                    <p className="font-semibold">Contains other elements</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>

              <ul className="pl-4 mt-2 space-y-2 mb-6">
                <li>
                  <span className="font-semibold">Note: </span>This app is
                  limited to classifying{" "}
                  <span className="font-semibold">trees only</span>.
                </li>
              </ul>
            </li>

            <li>
              Tap <span className="font-semibold">&#39;Scan leaf&#39;</span>{" "}
              button.
            </li>

            <li>
              Wait for your results! You can infer the progress of your scan by
              looking at the progress bar.
              <Image
                className="hidden md:block mx-auto my-4 rounded-lg"
                src={guideProgress}
                width={500}
                height={750}
                alt="Track your progress"
              />
              <Image
                className="md:hidden w-3/4 mx-auto my-4 rounded-lg"
                src={guideProgressMobile}
                width={500}
                height={750}
                alt="Track your progress"
              />
            </li>

            <li className="pb-4">
              Use this app as many times as you want by tapping
              <span className="font-semibold">&#39;Scan Again&#39;</span> button
              and scan another leaf.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
