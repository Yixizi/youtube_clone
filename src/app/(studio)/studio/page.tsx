export const dynamic = "force-dynamic";

import { DEFAULT_LIMIT } from "@/constants";
import StudioView from "@/modules/studio/views/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

export interface StudioProps {
  // children?: React.ReactNode;
}

const Studio: React.FC<StudioProps> = async (props) => {
  // const { children } = props;

  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default Studio;
Studio.displayName = "Studio";
