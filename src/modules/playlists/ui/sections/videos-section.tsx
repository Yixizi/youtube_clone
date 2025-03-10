"use client";

import InfiniteScroll from "@/components/infinite-scroll";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/video-grid-card";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

export interface VideosSectionProps {
  playlistId: string;
}

const VideosSectionSuspense: React.FC<VideosSectionProps> = (props) => {
  const { playlistId } = props;

  const utils = trpc.useUtils();
  const [videos, query] = trpc.playlists.getVideos.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      playlistId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video removed from playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({ videoId: data.playlistId });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      // if(error.data?.code==='')
    },
  });

  return (
    <div>
      <div className=" flex flex-col gap-4 gap-y-10 md:hidden ">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard
              key={video.id}
              data={video}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <div className=" hidden flex-col gap-4  md:flex ">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard
              key={video.id}
              data={video}
              size={"compact"}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

export const VideosSectionSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 gap-y-10 md:hidden  ">
        {Array.from({ length: 16 }).map((_, index) => {
          return <VideoGridCardSkeleton key={index} />;
        })}
      </div>
      <div className="hidden flex-col gap-4  md:flex  ">
        {Array.from({ length: 16 }).map((_, index) => {
          return <VideoRowCardSkeleton key={index} size={"compact"} />;
        })}
      </div>
    </div>
  );
};

const VideosSection: React.FC<VideosSectionProps> = (props) => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <VideosSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default VideosSection;
