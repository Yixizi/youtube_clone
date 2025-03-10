export const dynamic = "force-dynamic";

import { DEFAULT_LIMIT } from "@/constants";
import HomeView from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React, { memo } from "react";

export interface HomeProps {
  searchParams: Promise<{ categoryId?: string }>;
}

const Home: React.FC<HomeProps> = memo(async (props) => {
  const { searchParams } = props;
  const { categoryId } = await searchParams;

  void trpc.categories.getMany.prefetch();
  void trpc.video.getMany.prefetchInfinite({
    categoryId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <HomeView categoryId={categoryId}></HomeView>
    </HydrateClient>
  );
});

export default Home;
Home.displayName = "Home";
