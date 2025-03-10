export const dynamic = "force-dynamic";

import React from "react";
import { HydrateClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";
import TrendingView from "@/modules/home/ui/views/trending-view";
export interface VideoIdProps {

}

const VideoId: React.FC<VideoIdProps> = async (props) => {
  void trpc.video.getManyTrending.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient>
  );
};

export default VideoId;
// VideoId.displayName = "VideoId";
