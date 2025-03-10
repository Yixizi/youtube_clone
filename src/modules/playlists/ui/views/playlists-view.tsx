"use client";

import React, { memo, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import PlaylistCreateModal from "../components/playlist-create-modal";
import { ErrorBoundary } from "react-error-boundary";
import PlaylistsSection from "../sections/playlists-section";

export interface PlaylistsViewProps {}

const PlaylistsView: React.FC<PlaylistsViewProps> = memo((props) => {
  const [createModelOpen, setCreateModalOpen] = useState(false);

  return (
    <div
      className=" max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col
     gap-y-6 "
    >
      <PlaylistCreateModal
        open={createModelOpen}
        onOpenChange={setCreateModalOpen}
      />
      <div className=" flex justify-between items-center gap-5">
        <div>
          <h1 className=" text-2xl font-bold">Playlists</h1>
          <p className=" text-xs text-muted-foreground ">
            Collections you have created
          </p>
        </div>

        <Button
          onClick={() => {
            setCreateModalOpen(true);
          }}
          variant={"outline"}
          size={"icon"}
          className="rounded-full"
        >
          <PlusIcon />
        </Button>
      </div>
      <PlaylistsSection />
    </div>
  );
});

export default PlaylistsView;
PlaylistsView.displayName = "PlaylistsView";
