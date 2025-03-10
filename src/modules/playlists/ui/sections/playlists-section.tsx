"use client";

import InfiniteScroll from "@/components/infinite-scroll";

import { DEFAULT_LIMIT } from "@/constants";

import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import PlaylistGridCard, {
  PlaylistGridCardSkeleton,
} from "../components/playlist-grid-card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface PlaylistsSectionProps {}

const PlaylistsSectionSuspense: React.FC<PlaylistsSectionProps> = (props) => {
  const [playlists, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const utils = trpc.useUtils();
  const router = useRouter();
  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      toast.success("Playlist removed");
      utils.playlists.getMany.invalidate();
      router.push("/playlists");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return (
    <div>
      <div
        className=" gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
      xl:grid-cols-3 2xl:grid-cols-4  [@media(min-width:1980px)]:grid-cols-5
      [@media(min-width:2220px)]:grid-cols-6  "
      >
        {playlists.pages
          .flatMap((page) => page.items)
          .map((playlist) => (
            <PlaylistGridCard
              isDisabled={remove.isPending}
              buttonOnClick={() => remove.mutate({ id: playlist.id })}
              data={playlist}
              key={playlist.id}
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

export const PlaylistsSectionSkeleton = () => {
  return (
    <div>
      <div
        className=" gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
      xl:grid-cols-3 2xl:grid-cols-4  [@media(min-width:1980px)]:grid-cols-5
      [@media(min-width:2220px)]:grid-cols-6  "
      >
        {Array.from({ length: 16 }).map((_, index) => {
          return <PlaylistGridCardSkeleton key={index} />;
        })}
      </div>
    </div>
  );
};

const PlaylistsSection: React.FC<PlaylistsSectionProps> = (props) => {
  return (
    <Suspense fallback={<PlaylistsSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <PlaylistsSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default PlaylistsSection;
