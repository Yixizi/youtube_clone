import React, { useState } from "react";
import { CommentGetManyOutput } from "../../type";
import Link from "next/link";
import { UserAvatar } from "@/components/avatar";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { trpc } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CommentForm from "./comment-form";
import CommentReplies from "./comment-relies";

export interface CommentItemProps {
  children?: React.ReactNode;
  comment: CommentGetManyOutput["items"][number];
  variant?: "reply" | "comment";
}

const CommentItem: React.FC<CommentItemProps> = (props) => {
  const { comment, variant = "comment" } = props;

  const { userId } = useAuth();
  const utils = trpc.useUtils();
  const clerk = useClerk();
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  const remove = trpc.comments.remove.useMutation({
    onSuccess: () => {
      toast.success("Comment deleted");
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.success("Something went wrong");
      console.log(error);
      if (error.data?.code === "UNAUTHORIZED") {
        toast.success("可随意注册，无需验证");

        clerk.openSignIn();
      }
    },
  });

  const like = trpc.commentReactions.like.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        toast.success("可随意注册，无需验证");

        clerk.openSignIn();
      }
    },
  });
  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
                toast.success('可随意注册，无需验证')
        
        clerk.openSignIn();
      }
    },
  });

  return (
    <div className="pl-2 border-l">
      {comment.parentId && comment.parentId !== comment.originId && (
        <div className=" flex  pl-20 pr-20 gap-3 w-full  h-4">
          <div className=" text-muted-foreground text-[10px] shrink-0">
            回复用户:{comment.parentUser?.name}
          </div>
          <div className=" line-clamp-1 text-muted-foreground text-[10px]">
            回复内容:{comment.parent?.value}
          </div>
        </div>
      )}
      <div className="flex gap-4">
        <Link prefetch href={`/users/${comment.userId}`}>
          <UserAvatar
            size={variant === "comment" ? "lg" : "sm"}
            name={comment.user.name}
            imageUrl={comment.user.imageUrl}
          />
        </Link>
        <div className=" flex-1 min-w-0">
          <Link prefetch href={`/users/${comment.userId}`}>
            <div className=" flex items-center gap-2 mb-0.5">
              <span className=" font-medium text-sm pb-0.5 text-center">
                {comment.user.name}
              </span>
              <span className="text-xs text-muted-foreground text-center">
                {formatDistanceToNow(comment.createdAt, {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </div>
          </Link>

          <p className=" text-sm">{comment.value}</p>
          <div className=" flex items-center gap-2 mt-2">
            <div className=" flex flex-1 items-center">
              <Button
                disabled={dislike.isPending || like.isPending}
                className=" size-8"
                size={"icon"}
                variant={"ghost"}
                onClick={() => {
                  like.mutate({ commentId: comment.id });
                }}
              >
                <ThumbsUpIcon
                  className={cn(
                    comment.viewerReaction === "like" && "fill-black",
                  )}
                />
              </Button>
              <span className=" text-xs text-muted-foreground">
                {comment.likeCount}
              </span>

              <Button
                disabled={dislike.isPending || like.isPending}
                className=" size-8"
                size={"icon"}
                variant={"ghost"}
                onClick={() => {
                  dislike.mutate({ commentId: comment.id });
                }}
              >
                <ThumbsDownIcon
                  className={cn(
                    comment.viewerReaction === "dislike" && "fill-black",
                  )}
                />
              </Button>
              <span className=" text-xs text-muted-foreground">
                {comment.dislikeCount}
              </span>

              {variant === "comment" && (
                <Button
                  onClick={() => {
                    setIsReplyOpen(true);
                  }}
                  className=" h-8 ml-auto"
                  size={"sm"}
                  variant={"ghost"}
                >
                  Reply
                </Button>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className=" size-">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setIsReplyOpen(true);
              }}
            >
              <MessageSquareIcon className=" size-4" />
              Reply
            </DropdownMenuItem>

            {comment.user.clerkId === userId && (
              <DropdownMenuItem
                onClick={() => {
                  remove.mutate({ id: comment.id });
                }}
              >
                <Trash2Icon className=" size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isReplyOpen && (
        <div className=" mt-4 pl-14">
          <CommentForm
            videoId={comment.videoId}
            parentId={comment.id}
            variant="reply"
            originId={comment.originId || comment.id}
            onCancel={() => {
              setIsReplyOpen(false);
            }}
            onSuccess={() => {
              setIsReplyOpen(false);
              setIsRepliesOpen(true);
            }}
          />
        </div>
      )}

      {comment.replyCount && variant === "comment" && (
        <div className=" pl-14">
          <Button
            variant={"tertiary"}
            size={"sm"}
            onClick={() => {
              setIsRepliesOpen((cur) => !cur);
            }}
          >
            {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            {comment.replyCount} replies
          </Button>
        </div>
      )}
      {comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
        <CommentReplies originId={comment.id} videoId={comment.videoId} />
      )}
    </div>
  );
};

export default CommentItem;
CommentItem.displayName = "CommentItem";
