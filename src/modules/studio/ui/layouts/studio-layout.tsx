import { SidebarProvider } from "@/components/ui/sidebar";
import React, { memo } from "react";
import StudioNavbar from "../components/studio-navbar";
import StudioSidebar from "../components/studio-sidebar";

export interface StudioLayoutProps {
  children?: React.ReactNode;
}

const StudioLayout: React.FC<StudioLayoutProps> = memo((props) => {
  const { children } = props;

  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNavbar />
        <div className=" flex min-h-screen pt-[4rem]">
          <StudioSidebar></StudioSidebar>
          <main className=" flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
});

export default StudioLayout;
StudioLayout.displayName = "StudioLayout";
