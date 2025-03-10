"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import Link from "next/link";
import React, { memo } from "react";
import { usePathname } from "next/navigation";
import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { UserAvatar } from "@/components/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ListIcon } from "lucide-react";

export interface SubscriptionsSectionProps {}

const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = memo(
  (props) => {
    const pathname = usePathname();
    const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (last) => last.nextCursor,
      },
    );

    return (
      <SidebarGroup>
        <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {isLoading && <LoadingSkeleton />}
            {!isLoading &&
              data?.pages
                .flatMap((page) => page.items)
                .map((subscription) => (
                  <SidebarMenuItem
                    key={`${subscription.creatorId}-${subscription.viewerId}`}
                  >
                    <SidebarMenuButton
                      tooltip={subscription.user.name}
                      asChild
                      isActive={pathname === `/users/${subscription.user.id}`}
                    >
                      <Link
                        prefetch
                        href={`/users/${subscription.user.id}`}
                        className=" flex subscriptions-center gap-4"
                      >
                        <UserAvatar
                          size={"sm"}
                          imageUrl={subscription.user.imageUrl}
                          name={subscription.user.name}
                        />
                        <span className="text-sm">
                          {subscription.user.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            {!isLoading && (
              <SidebarMenuItem>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === "/subscriptions"}
                >
                  <Link
                    prefetch
                    href={"/subscriptions"}
                    className=" flex items-center gao-4"
                  >
                    <ListIcon className="size-4" />
                    <span className="text-sm">All subscriptions</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  },
);

export const LoadingSkeleton = () => {
  return Array.from({ length: 4 }).map((_, i) => (
    <SidebarMenuItem key={i} className=" flex items-center gap-4">
      <Skeleton className=" size-6 rounded-full shrink-0" />
      <Skeleton className="h-4 flex-1" />
    </SidebarMenuItem>
  ));
};

export default SubscriptionsSection;
SubscriptionsSection.displayName = "SubscriptionsSection";
