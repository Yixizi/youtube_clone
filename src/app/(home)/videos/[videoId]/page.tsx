export const dynamic = "force-dynamic";

import React from "react";
import { HydrateClient, trpc } from "@/trpc/server";
import VideoView from "@/modules/videos/ui/views/video-view";
import { DEFAULT_LIMIT } from "@/constants";
export interface VideoIdProps {
 
  params: Promise<{ videoId: string }>;
}

const VideoId: React.FC<VideoIdProps> = async (props) => {
  const {  params } = props;
  const { videoId } = await params;

  void trpc.video.getOne.prefetch({ id: videoId });

  void trpc.comments.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });

  void trpc.suggestions.getMany.prefetchInfinite({
    videoId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoId;
// VideoId.displayName = "VideoId";
