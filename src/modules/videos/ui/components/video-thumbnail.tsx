import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { THUMBNAIL_FALLBACK } from "../../constants";
import { Skeleton } from "@/components/ui/skeleton";

export interface VideoThumbnailProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  title: string;
  duration: number;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = (props) => {
  const { imageUrl, previewUrl, title, duration } = props;

  return (
    <div className=" relative group">
      <div className=" relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imageUrl ?? THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="h-full w-full object-cover group-hover:opacity-0"
        ></Image>
        <Image
          src={previewUrl ?? THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
        ></Image>
      </div>

      <div
        className=" absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 
      text-white text-x5 font-medium"
      >
        {formatDuration(duration)}
      </div>
    </div>
  );
};

export default VideoThumbnail;
VideoThumbnail.displayName = "VideoThumbnail";

export const VideoThumbnailSkeleton = () => {
  return (
    <div
      className=" relative min-w-[166px] w-full overflow-hidden 
     rounded-xl aspect-video flex  justify-center items-center"
    >
      <Skeleton className=" size-full" />
    </div>
  );
};
