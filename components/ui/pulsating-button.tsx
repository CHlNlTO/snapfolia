"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}

export default function PulsatingButton({
  className,
  children,
  pulseColor = "#04aa36",
  duration = "1.5s",
  ...props
}: PulsatingButtonProps) {
  return (
    <button
      className={cn(
        "relative text-center cursor-pointer flex justify-center items-center rounded-sm text-white dark:text-black bg-green-700 px-3 py-1 opacity-80",
        className
      )}
      style={
        {
          "--pulse-color": pulseColor,
          "--duration": duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-50 flex justify-center items-center flex-row gap-2">
        {children}
      </div>
      <div className="absolute top-1/2 left-1/2 size-full rounded-sm bg-inherit animate-pulse -translate-x-1/2 -translate-y-1/2" />
    </button>
  );
}
