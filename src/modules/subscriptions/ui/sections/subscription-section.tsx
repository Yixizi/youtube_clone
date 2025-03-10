"use client";

import InfiniteScroll from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";

import { trpc } from "@/trpc/client";
import Link from "next/link";
import React, { memo, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";
import SubscriptionItem, {
  SubscriptionItemSkeleton,
} from "../components/subscription-item";

export interface SubscriptonSectionProps {}

const SubscriptonSectionSuspense: React.FC<SubscriptonSectionProps> = (
  props,
) => {
  const utils = trpc.useUtils();
  const [subscriptions, query] =
    trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );
  const unSubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: (data) => {
      toast.success("unSubscribed");
      utils.users.getOne.invalidate({ id: data.creatorId });
      utils.video.getManySubscribed.invalidate();
      utils.subscriptions.getMany.invalidate();
    },
    onError: (error) => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div>
      <div className=" flex flex-col gap-4  ">
        {subscriptions?.pages
          .flatMap((page) => page.items)
          .map((subscription) => (
            <Link
              prefetch
              href={`/users/${subscription.user.id}`}
              key={subscription.creatorId}
            >
              <SubscriptionItem
                name={subscription.user.name}
                imageUrl={subscription.user.imageUrl}
                subscriberCount={subscription.user.subscriberCount}
                onUnsubscribe={() => {
                  unSubscribe.mutate({ userId: subscription.creatorId });
                }}
                disabled={unSubscribe.isPending}
              />
            </Link>
          ))}
      </div>

      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

export const SubscriptonSectionSkeleton = () => {
  return (
    <div className="flex flex-col gap-4  ">
      {Array.from({ length: 8 }).map((_, index) => {
        return <SubscriptionItemSkeleton key={index} />;
      })}
    </div>
  );
};

const SubscriptonSection: React.FC<SubscriptonSectionProps> = memo((props) => {
  return (
    <Suspense fallback={<SubscriptonSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <SubscriptonSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
});

export default SubscriptonSection;
