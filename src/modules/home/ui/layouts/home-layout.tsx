import { SidebarProvider } from "@/components/ui/sidebar";
import React, { memo } from "react";
import HomeNavbar from "../components/home-navbar";
import HomeSidebar from "../components/home-sidebar";

export interface HomeLayoutProps {
  children?: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = memo((props) => {
  const { children } = props;

  return (
    <SidebarProvider>
      <div className="w-full">
        <HomeNavbar />
        <div className=" flex min-h-screen pt-[4rem]">
          <HomeSidebar></HomeSidebar>
          <main className=" flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
});

export default HomeLayout;
HomeLayout.displayName = "HomeLayout";
