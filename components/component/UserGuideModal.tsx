"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUserGuide } from "@/contexts/UserGuideContext";
import UserGuide from "./UserGuide";

const UserGuideModal = () => {
  const { isOpen, setIsOpen } = useUserGuide();

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent className="sm:max-w-[600px] overflow-hidden md:mx-0 bg-transparent border-0 bg-none p-2 ring-0 focus:ring-0">
        <DialogTitle></DialogTitle>
        <UserGuide onClose={() => setIsOpen(false)} isModal={true} />
      </DialogContent>
    </Dialog>
  );
};

export default UserGuideModal;