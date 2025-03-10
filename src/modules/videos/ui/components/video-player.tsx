"use client";
import React from "react";
import MuxPlayer from "@mux/mux-player-react";
import { THUMBNAIL_FALLBACK } from "../../constants";

export interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayerSkeleton=()=>{
  return (
    <div className=" aspect-video bg-black rounded-xl"></div>
  )
}

const VideoPlayer: React.FC<VideoPlayerProps> = (props) => {
  const { playbackId, thumbnailUrl, autoPlay, onPlay } = props;

  return (
    <MuxPlayer
      playbackId={playbackId || ""}
      poster={thumbnailUrl ?? THUMBNAIL_FALLBACK}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      className=" w-full h-full object-contain"
      accentColor="#ff2056"
      onPlay={onPlay}
    />
  );
};

export default VideoPlayer;
VideoPlayer.displayName = "VideoPlayer";
