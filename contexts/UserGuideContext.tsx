"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserGuideContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const UserGuideContext = createContext<UserGuideContextType | undefined>(
  undefined
);

export function UserGuideProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check localStorage when the provider mounts
    const hasSeenGuide = localStorage.getItem("hasSeenUserGuide");
    if (!hasSeenGuide) {
      setIsOpen(true);
      localStorage.setItem("hasSeenUserGuide", "true");
    }
  }, []);

  return (
    <UserGuideContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </UserGuideContext.Provider>
  );
}

export function useUserGuide() {
  const context = useContext(UserGuideContext);
  if (context === undefined) {
    throw new Error("useUserGuide must be used within a UserGuideProvider");
  }
  return context;
}
