"use client";
import InfiniteScroll from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import CommentForm from "@/modules/comments/ui/components/comment-form";
import CommentItem from "@/modules/comments/ui/components/comment-item";
import { trpc } from "@/trpc/client";
import { Loader2Icon } from "lucide-react";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface CommentsSectionProps {
  children?: React.ReactNode;
  videoId: string;
}

const CommentsSectionSuspense: React.FC<CommentsSectionProps> = (props) => {
  const { videoId } = props;
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  return (
    <div className=" mt-6">
      <div className=" flex flex-col gap-6">
        <h1 className=" text-xl font-bold">
          {comments.pages[0].totalCount} Comments
        </h1>
      </div>
      <CommentForm videoId={videoId} />
      <div className=" flex flex-col gap-4 mt-2">
        {comments.pages
          .flatMap((page) => page.items)
          .map((comment, i) => {
            return (
              <CommentItem key={comment.id} comment={comment}></CommentItem>
            );
          })}
      </div>
      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

export const CommentsSectionSkeleton = () => {
  return (
    <div className=" mt-6 flex justify-center items-center">
      <Loader2Icon className=" text-muted-foreground animate-spin size-7" />
    </div>
  );
};

const CommentsSection: React.FC<CommentsSectionProps> = (props) => {
  const { videoId } = props;

  return (
    <Suspense fallback={<CommentsSectionSkeleton />}>
      <ErrorBoundary fallback={"...."}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default CommentsSection;
CommentsSection.displayName = "CommentsSection";
