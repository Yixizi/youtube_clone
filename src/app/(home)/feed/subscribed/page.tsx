export const dynamic = "force-dynamic";

import React from "react";
import { HydrateClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";
import SubscribedView from "@/modules/home/ui/views/subscribed-view";

export interface VideoIdProps {}

const VideoId: React.FC<VideoIdProps> = async (props) => {
  void trpc.video.getManySubscribed.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscribedView />
    </HydrateClient>
  );
};

export default VideoId;
// VideoId.displayName = "VideoId";
