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

export interface LikedVideosSectionProps {}

const LikedVideosSectionSuspense: React.FC<LikedVideosSectionProps> = (
  props,
) => {
  const [videos, query] = trpc.playlists.getLiked.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <div>
      <div className=" flex flex-col gap-4 gap-y-10 md:hidden ">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <div className=" hidden flex-col gap-4  md:flex ">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} data={video} size={"compact"} />
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

export const LikedVideosSectionSkeleton = () => {
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

const LikedVideosSection: React.FC<LikedVideosSectionProps> = (props) => {
  return (
    <Suspense fallback={<LikedVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <LikedVideosSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default LikedVideosSection;
