"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Leaf } from "@/lib/types";
import Image from "next/image";
import {
  Leaf as LeafIcon,
  TreePine,
  ScanLine,
  MapPin,
  Maximize2,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

interface LeafModalProps {
  leaf: Leaf;
  show: boolean;
  onHide: () => void;
}

export default function LeafModal({ leaf, show, onHide }: LeafModalProps) {
  const [showFullscreen, setShowFullscreen] = useState(false);

  return (
    <>
      <Dialog open={show} onOpenChange={onHide}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-auto bg-white dark:bg-zinc-900 max-h-[calc(100vh-10rem)] rounded-lg">
          {/* Hero Image Section */}
          <div className="relative w-full h-64 group">
            <DialogClose>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 bg-green-600 text-white hover:bg-white hover:text-green-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
            <Image
              src={leaf.treeImage}
              alt={`${leaf.name} Tree`}
              fill
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent cursor-pointer"
              onClick={() => setShowFullscreen(true)}
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 left-4 "
              onClick={() => setShowFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            <DialogHeader className="absolute bottom-0 left-0 p-6 w-full">
              <DialogTitle className="text-3xl font-bold text-white text-left">
                {leaf.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-white/80" />
                <p className="text-sm text-white/80 capitalize">
                  {leaf.location.replace("-", " ").toUpperCase()}
                </p>
              </div>
            </DialogHeader>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-6">
            {/* Names Section */}
            <div className="p-5 border rounded-xl border-green-100 dark:border-green-900 bg-green-50/50 dark:bg-green-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <LeafIcon className="w-5 h-5 mt-1 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-green-900 dark:text-green-100">
                    {leaf.englishName}
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400 italic">
                    {leaf.scientificName}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="rounded-xl border border-green-100 dark:border-green-900 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="p-5 border-b border-green-100 dark:border-green-900 bg-green-50/50 dark:bg-green-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                    <TreePine className="w-5 h-5 text-green-700 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-green-900 dark:text-green-100">
                    Description
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {leaf.description}
                </p>
              </div>
            </div>

            {/* Uses Section */}
            <div className="rounded-xl border border-green-100 dark:border-green-900 bg-white dark:bg-zinc-900 overflow-hidden">
              <div className="p-5 border-b border-green-100 dark:border-green-900 bg-green-50/50 dark:bg-green-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                    <ScanLine className="w-5 h-5 text-green-700 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg text-green-900 dark:text-green-100">
                    Uses
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <ul className="grid gap-3">
                  {leaf.uses.map((use, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-950 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 mt-2" />
                      <span className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {use}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Image Dialog */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-h-[calc(100vh-10rem)] p-0 bg-white/0 border-0">
          <div className="relative h-full">
            <div className="w-full h-full flex items-center justify-center p-1 bg-white rounded-lg">
              <DialogClose>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-50 bg-green-600 text-white hover:bg-white hover:text-green-600"
                  onClick={() => setShowFullscreen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
              <Image
                src={leaf.treeImage}
                alt={`${leaf.name} Tree`}
                className="object-contain w-auto rounded-lg"
                width={800}
                height={800}
                quality={100}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
