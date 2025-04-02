import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import React from "react";
import { VideoGetOneOutput } from "../../types";
import { useClerk } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

export interface VideoReactionsProps {
  children?: React.ReactNode;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
  videoId: string;
}

const VideoReactions: React.FC<VideoReactionsProps> = (props) => {
  const { likes, dislikes, viewerReaction, videoId } = props;

  const clerk = useClerk();
  const utils = trpc.useUtils();

  const like = trpc.viewReactions.like.useMutation({
    onSuccess: () => {
      utils.video.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        toast.success("可随意注册，无需验证");

        clerk.openSignIn();
      }
    },
  });
  const dislike = trpc.viewReactions.dislike.useMutation({
    onSuccess: () => {
      utils.video.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        toast.success("可随意注册，无需验证");

        clerk.openSignIn();
      }
    },
  });

  return (
    <div className=" flex items-center flex-none">
      <Button
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant={"secondary"}
        className=" rounded-l-full gap-2 pr-4"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className=" h-8 w-0.5" />
      <Button
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant={"secondary"}
        className=" rounded-r-full gap-2 pl-4"
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
      <Separator />
    </div>
  );
};

export default VideoReactions;
VideoReactions.displayName = "VideoReactions";
