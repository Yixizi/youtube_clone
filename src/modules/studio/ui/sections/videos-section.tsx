"use client";
import InfiniteScroll from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import React, { Suspense, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import VideoThumbnail from "@/modules/videos/ui/components/video-thumbnail";
import { snakeCaseToTitle } from "@/lib/utils";
import { format } from "date-fns";
import { Globe2Icon, LockIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface VideoSectionProps {}

const VideoSectionSuspense: React.FC<VideoSectionProps> = () => {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className=" text-right">Views</TableHead>
              <TableHead className=" text-right">Comments</TableHead>
              <TableHead className=" text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => {
                return (
                  <Link
                    prefetch
                    href={`/studio/videos/${video.id}`}
                    key={video.id}
                    legacyBehavior
                  >
                    <TableRow
                      className=" cursor-pointer"
                      key={video.id}
                      // onClick={() => router.push(`/studio/videos/${video.id}`)}
                    >
                      <TableCell className="pl-6 w-[450px]">
                        <div className="flex items-center gap-4">
                          <div className=" relative aspect-video w-36 shrink-0">
                            <VideoThumbnail
                              duration={video.duration || 0}
                              imageUrl={video.thumbnailUrl}
                              previewUrl={video.previewUrl}
                              title={video.title}
                            />
                          </div>

                          <div className="flex flex-col overflow-hidden gap-y-1">
                            <span className=" text-sm line-clamp-1">
                              {video.title}
                            </span>
                            <span className=" text-xs text-muted-foreground line-clamp-1">
                              {video.description || "No description"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className=" flex ">
                          {video.visibility === "private" ? (
                            <LockIcon className=" size-4 mr-2" />
                          ) : (
                            <Globe2Icon className=" size-4 mr-2 " />
                          )}
                          {snakeCaseToTitle(video.visibility)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {snakeCaseToTitle(video.muxStatus || "error")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(video.createdAt), "d MM yyyy")}
                      </TableCell>
                      <TableCell className=" text-right">
                        {video.viewCount}
                      </TableCell>
                      <TableCell className=" text-right">
                        {video.commentCount}
                      </TableCell>
                      <TableCell className=" text-right pr-6">
                        {video.likeCount}
                      </TableCell>
                    </TableRow>
                  </Link>
                );
              })}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      ></InfiniteScroll>
    </div>
  );
};

const VideoSectionSkeleton = () => {
  return (
    <>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[450px]">Video</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className=" text-right">Views</TableHead>
              <TableHead className=" text-right">Comments</TableHead>
              <TableHead className=" text-right pr-6">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className=" pl-6">
                    <div className=" flex items-center gap-6">
                      <Skeleton className=" h-[81px] w-[144px]" />
                      <div className="flex flex-col gap-y-2">
                        <Skeleton className="h-5 w-[100px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className=" h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className=" h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className=" h-4 w-16" />
                  </TableCell>
                  <TableCell className=" text-right">
                    <Skeleton className=" h-4 w-16 ml-auto" />
                  </TableCell>
                  <TableCell className=" text-right">
                    <Skeleton className=" h-4 w-16 ml-auto" />
                  </TableCell>
                  <TableCell className=" text-right pr-6">
                    <Skeleton className=" h-4 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

const VideoSection: React.FC<VideoSectionProps> = () => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <VideoSectionSuspense></VideoSectionSuspense>
      </ErrorBoundary>
    </Suspense>
  );
};

export default VideoSection;
