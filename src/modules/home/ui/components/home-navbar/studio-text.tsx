"use client";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@clerk/clerk-react";
import { useClerk } from "@clerk/nextjs";
import { ClapperboardIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

export interface StudioTextProps {
  children?: React.ReactNode;
}

const StudioText: React.FC<StudioTextProps> = (props) => {
  const { children } = props;
  const isMobile = useIsMobile();
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  return (
    <Button
      asChild
      variant={"secondary"}
      onClick={(e) => {
        if (!isSignedIn) {
          e.preventDefault();
          toast.success("可随意注册，无需验证");

          clerk.openSignIn();
        }
      }}
    >
      <Link prefetch href={"/studio"}>
        <ClapperboardIcon></ClapperboardIcon>
        {isMobile ? null : <span>Studio</span>}
      </Link>
    </Button>
  );
};

export default StudioText;
StudioText.displayName = "StudioText";
