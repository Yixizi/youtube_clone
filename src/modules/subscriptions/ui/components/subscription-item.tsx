import { UserAvatar } from "@/components/avatar";
import React from "react";
import SubscriptionButton from "./subscription-button";
import { Skeleton } from "@/components/ui/skeleton";

export interface SubscriptionItemProps {
  children?: React.ReactNode;
  name: string;
  subscriberCount: number;
  onUnsubscribe: () => void;
  disabled: boolean;
  imageUrl: string;
}

const SubscriptionItem: React.FC<SubscriptionItemProps> = (props) => {
  const { disabled, onUnsubscribe, name, imageUrl, subscriberCount } = props;

  return (
    <div className=" flex items-start gap-4">
      <UserAvatar name={name} size={"lg"} imageUrl={imageUrl} />

      <div className=" flex-1  ">
        <div className=" flex items-center justify-between">
          <div>
            <h3 className=" text-sm">{name}</h3>
            <p className=" text-xs text-muted-foreground">
              {subscriberCount.toLocaleString()} subscribers
            </p>
          </div>

          <SubscriptionButton
            size={"sm"}
            onClick={(e) => {
              e.preventDefault();
              onUnsubscribe();
            }}
            disabled={disabled}
            isSubscribed
          />
        </div>
      </div>
    </div>
  );
};

export const SubscriptionItemSkeleton = () => (
  <div className=" flex items-start gap-4">
    <Skeleton />
    <div className=" flex-1  ">
      <div className=" flex items-center justify-between">
        <div>
          <Skeleton className=" h-4 w-24" />
          <Skeleton className=" mt-1 h-3 w-28" />
        </div>

        <Skeleton className=" h-8 w-10 "/>
      </div>
    </div>
  </div>
);

export default SubscriptionItem;
SubscriptionItem.displayName = "SubscriptionItem";
