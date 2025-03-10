"use client";
import React, { Suspense } from "react";

import { util, z } from "zod";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import InfiniteScroll from "@/components/infinite-scroll";
import { toast } from "sonner";
import ResponsiveModal from "@/components/responsive-modal";

export interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}
const formSchema = z.object({
  name: z.string().min(1),
});

type formSchemaType = z.infer<typeof formSchema>;

const PlaylistAddModal: React.FC<PlaylistAddModalProps> = (props) => {
  const { open, onOpenChange, videoId } = props;
  const utils = trpc.useUtils();
  const {
    data: playlists,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.playlists.getManyForVideo.useInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      videoId,
    },
    {
      getNextPageParam: (last) => last.nextCursor,
      enabled: !!videoId && open,
    },
  );

  const addVideo = trpc.playlists.addVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video added to playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({
        videoId,
      });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      // if(error.data?.code==='')
    },
  });
  const removeVideo = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Video removed from playlist");
      utils.playlists.getMany.invalidate();
      utils.playlists.getManyForVideo.invalidate({
        videoId,
      });
      utils.playlists.getOne.invalidate({ id: data.playlistId });
      utils.playlists.getVideos.invalidate({ playlistId: data.playlistId });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      // if(error.data?.code==='')
    },
  });

  return (
    <ResponsiveModal
      title="Add to playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className=" flex flex-col gap-2 max-h-[60vh] overflow-auto">
        {isLoading && (
          <div className=" flex justify-center p-4">
            <Loader2Icon className=" animate-spin size-5 text-muted-foreground" />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                onClick={() => {
                  if (playlist.containsVideo) {
                    removeVideo.mutate({ playlistId: playlist.id, videoId });
                  } else {
                    addVideo.mutate({ playlistId: playlist.id, videoId });
                  }
                }}
                disabled={removeVideo.isPending || addVideo.isPending}
                key={playlist.id}
                variant={"ghost"}
                className=" w-full justify-start px-2 [&_svg]:size-5"
                size={"lg"}
              >
                {playlist.containsVideo ? (
                  <SquareCheckIcon className=" mr-2" />
                ) : (
                  <SquareIcon className=" mr-2" />
                )}
                {playlist.name}
              </Button>
            ))}

        {!isLoading && (
          <InfiniteScroll
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            isManual
            fetchNextPage={fetchNextPage}
          />
        )}
      </div>
    </ResponsiveModal>
  );
};

export default PlaylistAddModal;
PlaylistAddModal.displayName = "PlaylistAddModal";
