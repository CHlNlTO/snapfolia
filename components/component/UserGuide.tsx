"use client";

import React from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { Carousel } from "react-bootstrap";

interface Instruction {
  image: string;
  title: string;
  content: string;
}

const UserGuide = () => {
  const getImageUrl = (imageName: string): string =>
    `https://trees.firstasia.edu.ph/assets/img/${imageName}`;

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

              <img
                className="hidden md:block mx-auto my-4 rounded-lg"
                src={getImageUrl("guide-preferred.png")}
                alt="Preferred"
              />

              <Carousel className="md:hidden mx-auto w-3/4 mb-4">
                <Carousel.Item>
                  <img
                    className="w-full rounded-lg"
                    src={getImageUrl("guide-preferred-1.png")}
                    alt="Center"
                  />
                  <Carousel.Caption>
                    <p className="font-semibold">Subject is centered</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="w-full rounded-lg"
                    src={getImageUrl("guide-preferred-2.png")}
                    alt="Properly lit"
                  />
                  <Carousel.Caption>
                    <p className="font-semibold">Subject is properly lit</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="w-full rounded-lg"
                    src={getImageUrl("guide-preferred-3.png")}
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

              <img
                className="hidden md:block mx-auto my-4 rounded-lg"
                src={getImageUrl("guide-avoid.png")}
                alt="Avoid"
              />

              <Carousel className="md:hidden mx-auto w-3/4 mb-4">
                <Carousel.Item>
                  <img
                    className="w-full rounded-lg"
                    src={getImageUrl("guide-avoid-1.png")}
                    alt="Blurred"
                  />
                  <Carousel.Caption>
                    <p className="font-semibold">Subject is blurred</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="w-full rounded-lg"
                    src={getImageUrl("guide-avoid-2.png")}
                    alt="Contains other elements"
                  />
                  <Carousel.Caption>
                    <p className="font-semibold">Contains other elements</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="w-full rounded-lg"
                    src={getImageUrl("guide-avoid-3.png")}
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
              <img
                className="hidden md:block mx-auto my-4 rounded-lg"
                src={getImageUrl("guide-progress.png")}
                alt="Track your progress"
              />
              <img
                className="md:hidden w-3/4 mx-auto my-4 rounded-lg"
                src={getImageUrl("guide-progress-mobile.png")}
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
