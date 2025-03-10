import React, { memo } from "react";
import PlaylistHeaderSection from "../sections/playlist-header-section";
import VideosSection from "../sections/videos-section";

export interface VideosViewProps {
  playlistId: string;
}

const VideosView: React.FC<VideosViewProps> = memo((props) => {
  const { playlistId } = props;
  return (
    <div
      className=" max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col
     gap-y-6 "
    >
      <PlaylistHeaderSection playlistId={playlistId} />
      <VideosSection playlistId={playlistId} />
    </div>
  );
});

export default VideosView;
VideosView.displayName = "VideosView";
