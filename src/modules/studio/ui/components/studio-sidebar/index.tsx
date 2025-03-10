"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React, { memo } from "react";
import MainSection from "./main-section";
import { Separator } from "@/components/ui/separator";
import PersonalSection from "./personal-section";
import Link from "next/link";
import { LogOutIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import StudioSidebarHeader from "./studio-sidebar-header";

export interface StudioSidebarProps {}

const StudioSidebar: React.FC<StudioSidebarProps> = memo((props) => {
  const pathname = usePathname();

  return (
    <Sidebar className=" pt-16 z-40" collapsible="icon">
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarMenu>
            <StudioSidebarHeader></StudioSidebarHeader>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={pathname === "/studio"}
                tooltip={"Content"}
                asChild
              >
                <Link
                  prefetch
                  href={"/studio"}
                  className=" flex items-center gap-4"
                >
                  <LogOutIcon className="size-5" />
                  <span className="text-sm">Content</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Separator />

            <SidebarMenuItem>
              <SidebarMenuButton tooltip={"Exit studio"} asChild>
                <Link prefetch href={"/"} className=" flex items-center gap-4">
                  <LogOutIcon className="size-5" />
                  <span className="text-sm">Exit studio</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {/* <PersonalSection /> */}
      </SidebarContent>
    </Sidebar>
  );
});

export default StudioSidebar;
StudioSidebar.displayName = "StudioSidebar";
