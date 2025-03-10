import { DEFAULT_LIMIT } from "@/constants";
import UserView from "@/modules/users/ui/views/user-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";
export const dynamic = "force-dynamic";

export interface PageProps {
  params: Promise<{ userId: string }>;
}

const Page: React.FC<PageProps> = async (props) => {
  const { params } = props;
  const { userId } = await params;
  void trpc.users.getOne.prefetch({ id: userId });
  void trpc.video.getMany.prefetch({ userId, limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  );
};

export default Page;
