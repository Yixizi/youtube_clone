"use client";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "../components/video-row-card";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/video-grid-card";
import InfiniteScroll from "@/components/infinite-scroll";
import { sleep } from "@trpc/server/unstable-core-do-not-import";

export interface SuggestionsSectionProps {
  children?: React.ReactNode;
  videoId: string;
  isManual?: boolean;
}

const SuggestionsSectionSuspense: React.FC<SuggestionsSectionProps> = (
  props,
) => {
  // sleep(100000);

  const { isManual, videoId } = props;
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        videoId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <>
      <div className=" hidden md:block space-y-3">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoRowCard key={video.id} data={video} size={"compact"} />
          )),
        )}
      </div>
      <div className=" block md:hidden space-y-10">
        {suggestions.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard key={video.id} data={video} />
          )),
        )}
      </div>
      <InfiniteScroll
        isManual={isManual}
        isFetchingNextPage={query.isFetchingNextPage}
        hasNextPage={query.hasNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </>
  );
};

export const SuggestionsSectionSkeleton = () => {
  return (
    <>
      <div className=" hidden md:block space-y-3">
        {Array.from({ length: 4 }).map((_, index) => {
          return <VideoRowCardSkeleton key={index} size={"compact"} />;
        })}
      </div>
      <div className=" block md:hidden space-y-10">
        {Array.from({ length: 4 }).map((_, index) => {
          return <VideoGridCardSkeleton key={index} />;
        })}
      </div>
    </>
  );
};

const SuggestionsSection: React.FC<SuggestionsSectionProps> = (props) => {
  const { children, videoId, isManual } = props;

  return (
    <Suspense fallback={<SuggestionsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <SuggestionsSectionSuspense isManual={isManual} videoId={videoId}>
          {children}
        </SuggestionsSectionSuspense>
      </ErrorBoundary>
    </Suspense>
  );
};

export default SuggestionsSection;
