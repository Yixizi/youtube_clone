import React, { Suspense } from "react";
import VideoSection from "../sections/video-section";
import SuggestionsSection from "../sections/suggestions-section";
import CommentsSection from "../sections/comments-section";

export interface VideoViewProps {
  children?: React.ReactNode;
  videoId: string;
}

const VideoView: React.FC<VideoViewProps> = (props) => {
  const { videoId } = props;

  return (
    <div className=" flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10">
      <div className=" flex flex-col xl:flex-row gap-6">
        <div className="flex-1 mix-w-0">
          <VideoSection videoId={videoId} />
          <div className=" xl:hidden block mt-4 max-h-[60vh] overflow-auto  scrollbar-hide">
            <SuggestionsSection videoId={videoId} isManual />
          </div>
          <CommentsSection videoId={videoId} />
        </div>

        <div className=" hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-[1]">
          <SuggestionsSection videoId={videoId} />
        </div>
      </div>
    </div>
  );
};

export default VideoView;
VideoView.displayName = "VideoView";
