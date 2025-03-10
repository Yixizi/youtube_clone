export const dynamic = "force-dynamic";

import VideoView from "@/modules/studio/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

export interface VideoIdProps {

  params: Promise<{ videoId: string }>;
}

const VideoId: React.FC<VideoIdProps> = async (props) => {
  const { params } = props;
  const { videoId } = await params;

  void trpc.studio.getOne.prefetch({
    id: videoId,
  });
  void trpc.categories.getMany.prefetch();
  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default VideoId;
VideoId.displayName = "VideoId";
