"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserGuide } from "@/contexts/UserGuideContext";
import UserGuide from "./UserGuide";

const UserGuideModal = () => {
  const { isOpen, setIsOpen } = useUserGuide();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden md:mx-0 bg-transparent border-0 bg-none p-2 ring-0 focus:ring-0">
        <DialogTitle></DialogTitle>
        <UserGuide />

        <div className="flex justify-end relative">
          <Button
            variant="default"
            onClick={() => setIsOpen(false)}
            className="absolute top-0 right -translate-x-4 -translate-y-[90px] mt-4 hover:ring-2 hover:ring-green-600 hover:ring-offset-2 hover:ring-offset-white bg-gradient-to-r from-green-500 to-green-600 border border-1 border-green-300 ring-1 ring-green-300"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserGuideModal;
