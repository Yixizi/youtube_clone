"use client";

import InfiniteScroll from "@/components/infinite-scroll";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/video-grid-card";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface SubscribedVideosSectionProps {}

const SubscribedVideosSectionSuspense: React.FC<
  SubscribedVideosSectionProps
> = (props) => {
  const [videos, query] = trpc.video.getManySubscribed.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <div>
      <div
        className=" gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-rows-3 
      xl:grid-cols-3 2xl:grid-cols-4  [@media(min-width:1980px)]:grid-cols-5
      [@media(min-width:2220px)]:grid-cols-6  "
      >
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} col />
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

export const SubscribedVideosSectionSkeleton = () => {
  return (
    <div
      className=" gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-rows-3 
xl:grid-cols-3 2xl:grid-cols-4  [@media(min-width:1980px)]:grid-cols-5
[@media(min-width:2220px)]:grid-cols-6  "
    >
      {Array.from({ length: 16 }).map((_, index) => {
        return <VideoGridCardSkeleton key={index} col />;
      })}
    </div>
  );
};

const SubscribedVideosSection: React.FC<SubscribedVideosSectionProps> = (
  props,
) => {
  return (
    <Suspense fallback={<SubscribedVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <SubscribedVideosSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default SubscribedVideosSection;
