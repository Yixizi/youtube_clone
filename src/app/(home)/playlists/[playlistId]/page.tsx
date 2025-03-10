export const dynamic = "force-dynamic";

import { DEFAULT_LIMIT } from "@/constants";
import VideosView from "@/modules/playlists/ui/views/videos-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

export interface PlaylistsProps {

  params: Promise<{ playlistId: string }>;
}

const Playlists: React.FC<PlaylistsProps> = async (props) => {
  const { params } = props;
  const { playlistId } = await params;
  void trpc.playlists.getVideos.prefetchInfinite({
    limit: DEFAULT_LIMIT,
    playlistId,
  });
  void trpc.playlists.getOne.prefetch({
    id: playlistId,
  });

  return (
    <HydrateClient>
      <VideosView playlistId={playlistId} />
    </HydrateClient>
  );
};

export default Playlists;
Playlists.displayName = "Playlists";
