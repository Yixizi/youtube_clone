import { UserAvatar } from "@/components/avatar";
import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export interface StudioSidebarHeaderProps {}

const StudioSidebarHeader: React.FC<StudioSidebarHeaderProps> = (props) => {
  const { user } = useUser();
  const { state } = useSidebar();
  if (!user)
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className=" size-[112px] rounded-full" />
        <div className=" flex flex-col items-center mt-2 gap-y-1">
          <Skeleton className="h-5 w-[80px]"></Skeleton>
          <Skeleton className="h-7 w-[100px]"></Skeleton>
        </div>
      </SidebarHeader>
    );

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={"Your profile"} asChild>
          <Link prefetch href={"/users/current"}>
            <UserAvatar
              imageUrl={user.imageUrl}
              name={user.fullName || "User"}
              size="xs"
              className=" -ml-2"
            ></UserAvatar>
            <span className="text-sm">Your Profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link prefetch href={"/users/current"}>
        <UserAvatar
          imageUrl={user.imageUrl}
          name={user.fullName ?? "User"}
          className="size-[112px] hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className=" flex flex-col items-center mt-2 gap-y-1">
        <p className=" text-sm font-medium">Your profile</p>
        <p className=" text-xl text-muted-foreground">{user.fullName}</p>
      </div>
    </SidebarHeader>
  );
};

export default StudioSidebarHeader;
StudioSidebarHeader.displayName = "StudioSidebarHeader";
