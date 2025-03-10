import React from "react";
import { VideoGetOneOutput } from "../../types";
import Link from "next/link";
import { UserAvatar } from "@/components/avatar";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import SubscriptionButton from "@/modules/subscriptions/ui/components/subscription-button";
import UserInfo from "@/modules/users/ui/components/user-info";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";

export interface VideoOwnerProps {
  children?: React.ReactNode;
  user: VideoGetOneOutput["user"];
  videoId: string;
}

const VideoOwner: React.FC<VideoOwnerProps> = (props) => {
  const { user, videoId } = props;
  const { userId: userClerkId } = useAuth();
  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
    fromVideoId: videoId,
  });

  return (
    <div className=" flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
      <Link prefetch href={`/users/${user.id}`}>
        <div className=" flex items-center gap-3 min-w-0 ">
          <UserAvatar size={"lg"} name={user.name} imageUrl={user.imageUrl} />
          <div className=" flex flex-col gap-1 mim-w-0">
            <UserInfo size="lg" name={user.name} />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {user.subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>

      {userClerkId === user.clerkId ? (
        <Button className=" rounded-full" variant={"secondary"}>
          <Link prefetch href={`/studio/videos/${videoId}`}>
            Edit video
          </Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={() => {
            onClick();
          }}
          disabled={isPending}
          isSubscribed={user.viewerSubscribed}
          className="flex-none"
        />
      )}
    </div>
  );
};

export default VideoOwner;
VideoOwner.displayName = "VideoOwner";
