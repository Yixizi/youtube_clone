"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

export interface PlaylistHeaderSectionProps {
  children?: React.ReactNode;
  playlistId: string;
}

const PlaylistHeaderSectionSuspense: React.FC<PlaylistHeaderSectionProps> = (
  props,
) => {
  const { children, playlistId } = props;
  const utils = trpc.useUtils();
  const router = useRouter();
  const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });
  const remove = trpc.playlists.remove.useMutation({
    onSuccess: () => {
      toast.success("Playlist removed");
      utils.playlists.getMany.invalidate();
      router.push("/playlists");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  return (
    <div className=" flex justify-between items-center">
      <div>
        <h1 className=" text-2xl font-bold">{playlist.name}</h1>
        <p className=" text-xl text-muted-foreground">
          Videos from the playlist
        </p>
      </div>
      <Button
        variant={"outline"}
        size={"icon"}
        className="rounded-full"
        onClick={() => remove.mutate({ id: playlistId })}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
};

const PlaylistHeaderSectionSkeleton = () => {
  return (
    <div className=" flex flex-col gap-y-2">
      <Skeleton className=" h-6 w-24" />
      <Skeleton className=" h-6 w-32" />
    </div>
  );
};

const PlaylistHeaderSection: React.FC<PlaylistHeaderSectionProps> = (props) => {
  return (
    <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <PlaylistHeaderSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default PlaylistHeaderSection;
