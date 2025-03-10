import { DEFAULT_LIMIT } from "@/constants";
import HistoryView from "@/modules/playlists/ui/views/history-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";
export const dynamic = "force-dynamic";

export interface PlaylistsProps {
  
}

const Playlists: React.FC<PlaylistsProps> = async (props) => {
  void trpc.playlists.getHistory.prefetchInfinite({ limit: DEFAULT_LIMIT });

  return (
    <HydrateClient>
      <HistoryView />
    </HydrateClient>
  );
};

export default Playlists;
Playlists.displayName = "Playlists";
