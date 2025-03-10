"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideoPlayer, { VideoPlayerSkeleton } from "../components/video-player";
import VideoBanner from "../components/video-banner";
import VideoTopRow, { VideoTopRowSkeleton } from "../components/video-top-row";
import { useAuth } from "@clerk/nextjs";

export interface VideoSectionProps {
  children?: React.ReactNode;
  videoId: string;
}

const VideoSectionSuspense: React.FC<VideoSectionProps> = (props) => {
  const { children, videoId } = props;

  const { isSignedIn } = useAuth();
  const utils = trpc.useUtils();
  const [video] = trpc.video.getOne.useSuspenseQuery({ id: videoId });
  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      utils.video.getOne.invalidate({ id: videoId });
    },
  });

  const handlePlay = () => {
    if (!isSignedIn) return;
    createView.mutate({
      videoId,
    });
    console.log("createdView");
  };

  return (
    <>
      <div
        className={cn(
          "aspect-video bg-black rounded-xl overflow-hidden relative",
          video.muxStatus !== "ready" && "rounded-b-none",
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={() => {
            handlePlay();
          }}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>

      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};

const VideoSectionSkeleton = () => {
  return (
    <>
      <VideoPlayerSkeleton />
      <VideoTopRowSkeleton />
    </>
  );
};

const VideoSection: React.FC<VideoSectionProps> = (props) => {
  const { children, videoId } = props;

  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <VideoSectionSuspense videoId={videoId}>
          {children}
        </VideoSectionSuspense>
      </ErrorBoundary>
    </Suspense>
  );
};

export default VideoSection;
