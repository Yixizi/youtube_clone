import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_URL } from "@/constants";
import PlaylistAddModal from "@/modules/playlists/ui/components/playlist-add-modal";
import {
  ListPlusIcon,
  MoreVerticalIcon,
  ShareIcon,
  Trash2Icon,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export interface VideoMenuProps {
  children?: React.ReactNode;
  videoId: string;
  variant?: "ghost" | "secondary";
  onRemove?: () => void;
}

const VideoMenu: React.FC<VideoMenuProps> = (props) => {
  const { children, videoId, variant = "ghost", onRemove } = props;

  const [isOpenPlaylistAddModal, isSetOpenPlaylistAddModal] = useState(false);

  const onShare = () => {
    const fullUrl = `${APP_URL}/videos/${videoId}`;

    navigator.clipboard.writeText(fullUrl);

    toast.success("Link copied to the clipboard");
  };

  return (
    <>
      <PlaylistAddModal
        videoId={videoId}
        open={isOpenPlaylistAddModal}
        onOpenChange={isSetOpenPlaylistAddModal}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={"icon"} className="rounded-full">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem
            onClick={() => {
              onShare();
            }}
          >
            <ShareIcon className=" me-2 size-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              isSetOpenPlaylistAddModal(true);
            }}
          >
            <ListPlusIcon className=" me-2 size-4" />
            Add to playlist
          </DropdownMenuItem>
          {onRemove && (
            <DropdownMenuItem
              onClick={() => {
                onRemove();
              }}
            >
              <Trash2Icon className=" me-2 size-4" />
              Remove
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default VideoMenu;
VideoMenu.displayName = "VideoMenu";
