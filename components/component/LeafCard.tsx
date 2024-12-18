"use client";

import { useState } from "react";
import LeafModal from "./LeafModal";
import Image from "next/image";
import { Leaf } from "@/lib/types";

interface LeafCardProps {
  leaf: Leaf;
}

export default function LeafCard({ leaf }: LeafCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <button
        className="w-full text-left focus:outline-none flex flex-row p-4"
        onClick={() => setShowModal(true)}
      >
        <div className="relative w-full flex flex-col items-start justify-center">
          <Image
            src={leaf.image}
            alt={leaf.name}
            className="object-contain"
            width={80}
            height={80}
          />
        </div>
        <div className="p-4 text-right flex flex-col gap-1 w-full">
          <h2 className="text-3xl font-bold text-green-900">{leaf.name}</h2>
          <p className="text-xs font-light text-green-600">
            {leaf.englishName}
          </p>
        </div>
      </button>
      <LeafModal
        leaf={leaf}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
    </div>
  );
}
