"use client";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import UserPageBanner, {
  UserPageBannerSkeleton,
} from "../components/user-page-banner";
import UserPageInfo, {
  UserPageInfoSkeleton,
} from "../components/user-page-info";
import { Separator } from "@/components/ui/separator";

export interface UserSectionProps {
  children?: React.ReactNode;
  userId: string;
}

const UserSectionSuspense: React.FC<UserSectionProps> = (props) => {
  const { userId } = props;

  const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });

  return (
    <div className=" flex flex-col">
      <UserPageBanner user={user} />
      <UserPageInfo user={user} />
    </div>
  );
};

const UserSectionSkeleton = () => {
  return (
    <div className=" flex flex-col">
      <UserPageBannerSkeleton />
      <UserPageInfoSkeleton />
      <Separator />
    </div>
  );
};

const UserSection: React.FC<UserSectionProps> = (props) => {
  return (
    <Suspense fallback={<UserSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <UserSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default UserSection;
