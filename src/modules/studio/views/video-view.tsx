import React from "react";
import FormSection from "../ui/sections/form-section";

export interface VideoViewProps {

  videoId: string;
}

const VideoView: React.FC<VideoViewProps> = (props) => {
  const { videoId } = props;

  return (
    <div className=" px-4 pt-2.5 max-w-screen-lg">
      <FormSection videoId={videoId} />
    </div>
  );
};

export default VideoView;
VideoView.displayName = "VideoView";
