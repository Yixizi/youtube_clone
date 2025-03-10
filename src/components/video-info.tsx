import { VideoGetManyOutput } from "@/modules/videos/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React, { useMemo } from "react";
import { UserAvatar } from "./avatar";
import UserInfo from "@/modules/users/ui/components/user-info";
import VideoMenu from "@/modules/videos/ui/components/video-menu";
import { Skeleton } from "./ui/skeleton";

export interface VideoInfoProps {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

const VideoInfo: React.FC<VideoInfoProps> = (props) => {
  const { data, onRemove } = props;

  const compactViews = useMemo(() => {
    return Intl.NumberFormat("zh", {
      notation: "compact",
    }).format(data.viewCount);
  }, [data.viewCount]);
  const compactData = useMemo(() => {
    return formatDistanceToNow(data.createdAt, {
      addSuffix: true,
    });
  }, [data.createdAt]);

  return (
    <div className="  min-w-0">
      <div className=" flex gap-3 justify-between">
        <div className=" flex-1 flex  gap-3 ">
          <Link prefetch href={`/users/${data.user.id}`}>
            <UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
          </Link>

          <div className=" min-w-0 flex-1">
            <Link prefetch href={`/videos/${data.id}`}>
              <h3 className=" font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
                {data.title}
              </h3>
            </Link>
            <Link prefetch href={`/users/${data.user.id}`}>
              <UserInfo name={data.user.name} />
            </Link>
          </div>
        </div>
        <div className="">
          <VideoMenu videoId={data.id} onRemove={onRemove} />
        </div>
      </div>
      <div>
        <Link prefetch href={`/videos/${data.id}`}>
          <p className="text-sm text-gray-600 ">
            <span>{compactViews} views</span>

            <span className="mx-1  sm-hidden">· {compactData}</span>

            <span className="hidden sm-block">{compactData}</span>
          </p>
        </Link>
      </div>
    </div>
  );
};

export default VideoInfo;
VideoInfo.displayName = "VideoInfo";

export const VideoInfoSkeleton = () => {
  return (
    <div className=" flex flex-1 flex-col gap-3">
      <div className=" flex gap-x-3 ">
        <Skeleton className="size-10 flex-shrink-0 rounded-full" />
        <div className=" flex flex-col gap-y-2">
          <Skeleton className="w-[80px] h-5" />
          <Skeleton className="w-[60px] h-4" />
        </div>
      </div>
      <div className=" min-h-0 flex-1 space-y-2">
        <Skeleton className="w-[90%] h-5" />
        <Skeleton className="w-[70%] h-5 block  sm-hidden" />
      </div>
    </div>
  );
};
