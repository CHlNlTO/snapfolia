"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { instructions } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { File, Plus, Leaf, Trash2 } from "lucide-react";
import Image from "next/image";
import { type DragEvent, useRef, useState } from "react";
import ImageIcon from "./ImageIcon";
import { useFileStore } from "@/store/useFileStore";

export function FileUpload() {
  const { file, setFile, handleScan, clearFile } = useFileStore();
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Consolidated drag event handlers
  const handleDragEvents = (
    e: DragEvent<HTMLDivElement>,
    isActive: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(isActive);
  };

  // Unified file handling logic
  const processFile = (uploadedFile: File) => {
    // Revoke previous file preview if exists
    if (file) {
      URL.revokeObjectURL(file.preview);
    }

    // Create new file with preview
    const newFile = Object.assign(uploadedFile, {
      preview: URL.createObjectURL(uploadedFile),
    });
    setFile(newFile);
  };

  // Event handlers
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
    // Reset the input value to allow the same file to be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    // Reset the input value to allow the same file to be selected again
    e.target.value = "";
  };

  const handleDeleteFile = () => {
    clearFile();
    // Reset the input value to allow the same file to be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Shared motion animations
  const hoverAnimation = {
    scale: 1.01,
    boxShadow: "0px 0px 0px 0px #229956",
    WebkitBoxShadow: "0px 0px 0px 0px #229956",
    MozBoxShadow: "0px 0px 0px 0px #229956",
  };

  // Leaf animation
  // const leafAnimation = {
  //   animate: { y: [-2, 2] },
  //   transition: {
  //     duration: 1.5,
  //     repeat: Infinity,
  //     repeatType: "reverse" as const,
  //     ease: "easeInOut",
  //   },
  // };

  return (
    <div className="h-80 w-80 p-8 pb-0 rounded-2xl space-y-4 flex flex-col justify-center items-center">
      <motion.div
        className={`group relative flex justify-center items-center cursor-pointer rounded-xl w-full h-64 shadow-green-900 shadow-lg border-2 border-dashed px-12 py-0 mx-4 text-center transition-colors ring-green-600 focus:p-1 outline-green-600 ${
          isDragActive
            ? "border-green-300 bg-green-300/5"
            : "border-green-500 bg-green-500/5 hover:border-green-400 dark:border-green-700 dark:hover:border-green-500"
        }`}
        initial={hoverAnimation}
        animate={{
          scale: 1,
        }}
        transition={{ duration: 0.1, ease: "easeInOut" }}
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        whileHover={hoverAnimation}
        whileTap={{
          scale: 1.01,
        }}
      >
        <AnimatePresence>
          {isDragActive ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none select-none flex flex-col items-center space-y-2"
            >
              <ImageIcon className="mx-auto text-green-500 opacity-80 w-12 h-12" />
              <Button className="font-medium bg-green-500 text-white text-sm dark:text-neutral-500 opacity-80">
                <Plus className="text-white fill-current " />
                <span className="text-xs font-normal">
                  {instructions.fileUpload}
                </span>
              </Button>
            </motion.div>
          ) : (
            !file && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                initial={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center space-y-2"
              >
                <ImageIcon className="mx-auto text-green-700/50 opacity-80 dark:text-neutral-500 w-16 h-16" />
                <Button className="font-medium bg-gradient-to-r from-green-500 to-green-600 border border-1 border-green-300 ring-1 ring-green-300 text-white text-sm dark:text-neutral-500 rounded-2xl hover:ring-2 hover:ring-green-600 hover:ring-offset-2 hover:ring-offset-white">
                  <div>
                    <Plus className="text-green-200 fill-current" />
                  </div>
                  <span className="text-xs font-normal">
                    {instructions.fileUpload}
                  </span>
                </Button>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {file && (
          <div className="absolute inset-0 -z-10">
            {file.type.startsWith("image/") ? (
              <Image
                alt={file.name}
                className="w-full h-full rounded object-contain"
                src={file.preview}
                fill
                sizes="100%"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <File className="size-10 text-neutral-500" />
              </div>
            )}
          </div>
        )}

        <Input
          accept="image/*"
          className="hidden"
          multiple={false}
          onChange={handleFileInputChange}
          ref={fileInputRef}
          type="file"
        />
      </motion.div>

      {file && (
        <div className="flex flex-col items-center justify-center">
          <motion.div className="flex flex-row items-center justify-center space-x-2">
            <Button
              className="font-medium bg-gradient-to-r from-green-500 to-green-600 border border-1 border-green-300 ring-1 ring-green-300 text-white text-sm dark:text-neutral-500 opacity-80 rounded-2xl hover:ring-2 hover:ring-green-600 hover:ring-offset-2 hover:ring-offset-white"
              onClick={() => handleScan()}
            >
              <div>
                <Leaf className="text-green-200 fill-current w-3" />
              </div>
              <span className="text-xs font-normal">Scan Leaf</span>
            </Button>
            <Button
              className="font-medium bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-500  text-sm opacity-80 rounded-2xl hover:ring-2 hover:ring-red-600 hover:ring-offset-2 hover:ring-offset-white"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile();
              }}
            >
              <div>
                <Trash2 className="size-5 cursor-pointer text-white transition-colors" />
              </div>
              <span className="text-xs font-normal text-white">Remove</span>
            </Button>
          </motion.div>
        </div>
      )}

      {!file && (
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-center space-x-2">
            <Button
              className="font-medium bg-green-700 text-white text-sm dark:text-neutral-500 opacity-80 rounded-2xl hover:ring-2 hover:ring-green-600 hover:ring-offset-2 hover:ring-offset-white"
              disabled
            >
              <div>
                <Leaf className="text-green-200 fill-current w-3" />
              </div>
              <span className="text-xs font-normal">Scan Leaf</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
