"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HistoryIcon, ListVideoIcon, ThumbsUpIcon } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

import Link from "next/link";
import React, { memo } from "react";
import { usePathname } from "next/navigation";

export interface PersonalSectionProps {}

const item = [
  {
    title: "History",
    url: "/playlists/history",
    icon: HistoryIcon,
    auth: true,
  },
  {
    title: "Like videos",
    url: "/playlists/liked",
    icon: ThumbsUpIcon,
    auth: true,
  },
  {
    title: "All playlists",
    url: "/playlists",
    icon: ListVideoIcon,
    auth: true,
  },
];

const PersonalSection: React.FC<PersonalSectionProps> = memo((props) => {
  const pathname = usePathname();

  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>You</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {item.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                onClick={(e) => {
                  if (!isSignedIn && item.auth) {
                    e.preventDefault();
                    toast.success("可随意注册，无需验证");

                    return clerk.openSignIn();
                  }
                }}
                tooltip={item.title}
                asChild
                isActive={pathname === item.url}
              >
                <Link
                  prefetch
                  href={item.url}
                  className=" flex items-center gap-4"
                >
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
});

export default PersonalSection;
PersonalSection.displayName = "PersonalSection";
