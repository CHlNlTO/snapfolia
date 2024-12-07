"use client";

import React, { createContext, useContext, useState } from "react";

type UserGuideContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const UserGuideContext = createContext<UserGuideContextType | undefined>(
  undefined
);

export function UserGuideProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <UserGuideContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </UserGuideContext.Provider>
  );
}

export const useUserGuide = () => {
  const context = useContext(UserGuideContext);
  if (context === undefined) {
    throw new Error("useUserGuide must be used within a UserGuideProvider");
  }
  return context;
};
