import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
}

const ResponsiveModal: React.FC<ResponsiveModalProps> = (props) => {
  const { children, open, title, onOpenChange } = props;
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} autoFocus={open}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          {/* <div className=" max-h-[60vh] overflow-auto">{children}</div> */}
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {/* <div className=" max-h-[60vh] overflow-auto">{children}</div> */}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveModal;
ResponsiveModal.displayName = "ResponsiveModal";
