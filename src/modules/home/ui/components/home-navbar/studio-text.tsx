"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";

export interface StudioTextProps {
  children?: React.ReactNode;
}

const StudioText: React.FC<StudioTextProps> = (props) => {
  const { children } = props;
  const isMobile = useIsMobile();

  return isMobile ? null : <span>Studio</span>;
};

export default StudioText;
StudioText.displayName = "StudioText";
