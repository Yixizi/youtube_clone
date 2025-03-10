import { PlaylistGetManyOutput } from "@/modules/playlists/type";
import Link from "next/link";
import React from "react";
import PlaylistThumbnail, {
  PlaylistThumbnailSkeleton,
} from "./playlist-thumbnail";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import PlaylistInfo, { PLaylistInfoSkeleton } from "./playlist-info";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PlaylistGridCardProps {
  children?: React.ReactNode;
  data: PlaylistGetManyOutput["items"][number];
  buttonOnClick?: () => void;
  isDisabled?: boolean;
}

const PlaylistGridCard: React.FC<PlaylistGridCardProps> = (props) => {
  const { data, buttonOnClick, isDisabled } = props;

  return (
    <Link prefetch href={`/playlists/${data.id}`}>
      <div className="relative flex flex-col gap-2 w-full group">
        {buttonOnClick && (
          <Button
            disabled={isDisabled}
            onClick={(e) => {
              e.preventDefault();
              buttonOnClick?.();
            }}
            variant={"outline"}
            className=" fill-white absolute right-2 top-4 z-50 opacity-40 rounded-full hover:opacity-90"
          >
            <Trash2Icon />
          </Button>
        )}
        <PlaylistThumbnail
          imageUrl={data.thumbnailUrl || THUMBNAIL_FALLBACK}
          title={data.name}
          videoCount={data.videoCount}
        />
        <PlaylistInfo data={data} />
      </div>
    </Link>
  );
};

export const PlaylistGridCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full ">
      <PlaylistThumbnailSkeleton />
      <PLaylistInfoSkeleton />
    </div>
  );
};

export default PlaylistGridCard;
PlaylistGridCard.displayName = "PlaylistGridCard";
