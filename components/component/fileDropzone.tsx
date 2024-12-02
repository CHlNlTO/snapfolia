"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { instructions } from "@/lib/data";
import { AnimatePresence, motion } from "framer-motion";
import { File, Trash2, Image as ImageIcon, Plus, Leaf } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { type DragEvent, useRef, useState } from "react";

interface FileWithPreview extends File {
  preview: string;
}

export function FileDropzone() {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFile = (uploadedFile: File) => {
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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDeleteFile = () => {
    if (file) {
      URL.revokeObjectURL(file.preview);
      setFile(null);
    }
  };

  return (
    <div className="h-60 w-96 p-8 rounded-2xl mt-20">
      <motion.div
        className={`group relative size-full cursor-pointer rounded-xl shadow-green-900 shadow-lg border-2 border-dashed p-12 text-center transition-colors ${
          isDragActive
            ? "border-green-300 bg-green-300/5"
            : " border-green-500 bg-green-500/5 hover:border-green-400 dark:border-green-700 dark:hover:border-green-500"
        }`}
        initial={{
          scale: 1.01,
          boxShadow: "0px 0px 0px 0px #229956",
          WebkitBoxShadow: "0px 0px 0px 0px #229956",
          MozBoxShadow: "0px 0px 0px 0px #229956",
        }}
        animate={{
          scale: 1,
          boxShadow: "10px 10px 0px 0px #229956",
          WebkitBoxShadow: "10px 10px 0px 0px 0px #229956",
          MozBoxShadow: "10px 10px 0px 0px #229956",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={handleButtonClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{
          scale: 1.01,
          boxShadow: "0px 0px 0px 0px #229956",
          WebkitBoxShadow: "0px 0px 0px 0px #229956",
          MozBoxShadow: "0px 0px 0px 0px #229956",
        }}
        whileTap={{
          scale: 0.98,
          boxShadow: "0px 0px 0px 0px #229956",
          WebkitBoxShadow: "0px 0px 0px 0px #229956",
          MozBoxShadow: "0px 0px 0px 0px #229956",
        }}
        style={{
          boxShadow: "10px 10px 0px 0px #229956",
          WebkitBoxShadow: "10px 10px 0px 0px #229956",
          MozBoxShadow: "10px 10px 0px 0px #229956",
        }}
      >
        <Input
          accept="image/*,application/pdf"
          className="hidden"
          multiple={false}
          onChange={handleFileInputChange}
          ref={fileInputRef}
          type="file"
        />
        <AnimatePresence>
          {isDragActive ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className=" pointer-events-none select-none flex flex-col items-center space-y-2"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <ImageIcon className="mx-auto text-green-500 opacity-80 dark:text-neutral-500 w-12 h-12" />
              <Button className="font-medium bg-green-500 text-white text-sm dark:text-neutral-500 opacity-80">
                <span>
                  <Plus className="text-white fill-current" />
                </span>
                <span className="text-xs font-normal">
                  {instructions.fileUpload}
                </span>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center space-y-2"
            >
              <ImageIcon className="mx-auto text-green-700 opacity-80 dark:text-neutral-500 w-12 h-12" />
              <Button className="font-medium bg-green-700 text-white text-sm dark:text-neutral-500 opacity-80 rounded-2xl">
                <span>
                  <Leaf className="text-green-200 fill-current" />
                </span>
                <span className="text-xs font-normal">
                  {instructions.fileUpload}
                </span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {file && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 space-y-2"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center rounded-lg bg-neutral-400/10 p-1"
              exit={{ opacity: 0, x: 20 }}
              initial={{ opacity: 0, x: -20 }}
              key={file.name}
            >
              {file.type.startsWith("image/") ? (
                <Image
                  alt={file.name}
                  className="mr-2 size-10 rounded object-cover"
                  src={file.preview}
                  width={40}
                  height={40}
                />
              ) : (
                <File className="mr-2 size-10 text-neutral-500" />
              )}
              <span className="flex-1 truncate text-neutral-600 text-xs tracking-tighter dark:text-neutral-400">
                {file.name}
              </span>
              <Trash2
                className="mr-2 size-5 cursor-pointer text-red-500 transition-colors hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FileDropzone;
