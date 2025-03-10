import { VideoGetManyOutput } from "@/modules/videos/types";
import VideoThumbnail, {
  VideoThumbnailSkeleton,
} from "@/modules/videos/ui/components/video-thumbnail";
import Link from "next/link";
import React from "react";
import VideoInfo, { VideoInfoSkeleton } from "./video-info";
import { cn } from "@/lib/utils";
import { boolean } from "drizzle-orm/mysql-core";

interface VideoGridCardProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
  col?: boolean;
}
const VideoGridCard: React.FC<VideoGridCardProps> = (props) => {
  const { data, onRemove, col } = props;

  return (
    <div className={cn(" flex  gap-5 w-full group", col && "flex-col")}>
      <Link prefetch href={`/videos/${data.id}`} className="min-w-[166px]">
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration}
        />
      </Link>

      <div className=" flex-1 w-full px-4">
        <VideoInfo data={data} onRemove={onRemove} />
      </div>
    </div>
  );
};

export default VideoGridCard;
VideoGridCard.displayName = "VideoGridCard";

interface VideoGridCardSkeletonProps {
  col?: boolean;
}
export const VideoGridCardSkeleton: React.FC<VideoGridCardSkeletonProps> = (
  props,
) => {
  const { col } = props;
  return (
    <div
      className={cn(" flex justify-around  gap-2 w-full", col && "flex-col")}
    >
      <div className={cn(col ? "w-full" : " max-w-[38%] min-w-[166px]")}>
        <VideoThumbnailSkeleton />
      </div>

      <VideoInfoSkeleton />
    </div>
  );
};
