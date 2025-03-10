import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { CornerDownRightIcon, Loader2Icon } from "lucide-react";
import React from "react";
import CommentItem from "./comment-item";
import { Button } from "@/components/ui/button";

export interface CommentRepliesProps {
  children?: React.ReactNode;
  originId: string;
  videoId: string;
}

const CommentReplies: React.FC<CommentRepliesProps> = (props) => {
  const { children, originId, videoId } = props;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
        videoId,
        originId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  return (
    <div className=" pl-14">
      <div className=" flex flex-col gap-4 mt-2">
        {isLoading && (
          <div className=" flex items-center justify-center">
            <Loader2Icon className=" size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading &&
          data?.pages
            .flatMap((page) => page.items)
            .map((comment) => {

              return (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  variant="reply"
                />
              );
            })}
      </div>
      {hasNextPage && (
        <Button
          variant={"tertiary"}
          size="sm"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          <CornerDownRightIcon />
          show more replies
        </Button>
      )}
    </div>
  );
};

export default CommentReplies;
CommentReplies.displayName = "CommentReplies";
