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

export interface ResultsSectionProps {
  children?: React.ReactNode;

  query: string | undefined;
  categoryId: string | undefined;
}

const ResultsSectionSuspense: React.FC<ResultsSectionProps> = (props) => {
  const { children, query, categoryId } = props;

  const [search, searchQuery] =
    trpc.homeSearch.getMany.useSuspenseInfiniteQuery(
      {
        query,
        limit: DEFAULT_LIMIT,
        categoryId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <>
      <div className=" flex flex-col gap-4 gap-y-10 md:hidden">
        {search.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>

      <div className=" hidden flex-col gap-4 md:flex">
        {search.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} data={video} size={"default"} />
          ))}
      </div>

      <InfiniteScroll
        hasNextPage={searchQuery.hasNextPage}
        isFetchingNextPage={searchQuery.isFetchingNextPage}
        fetchNextPage={searchQuery.fetchNextPage}
      />
    </>
  );
};

export const ResultsSectionSkeleton = () => {
  return (
    <div>
      <div className=" hidden flex-col gap-4 md:flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
      <div className=" flex flex-col gap-4 gap-y-10 pt-6 md:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
const ResultsSection: React.FC<ResultsSectionProps> = (props) => {
  return (
    <Suspense
      key={`${props.query}-${props.categoryId}`}
      fallback={<ResultsSectionSkeleton />}
    >
      <ErrorBoundary fallback={<p>Error</p>}>
        <ResultsSectionSuspense {...props}></ResultsSectionSuspense>
      </ErrorBoundary>
    </Suspense>
  );
};

export default ResultsSection;
