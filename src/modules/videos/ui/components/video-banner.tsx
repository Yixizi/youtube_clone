import React from "react";

import { VideoGetOneOutput } from "../../types";
import { AlertTriangleIcon } from "lucide-react";

export interface VideoBannerProps {
  children?: React.ReactNode;
  status: VideoGetOneOutput["muxStatus"];
}

const VideoBanner: React.FC<VideoBannerProps> = (props) => {
  const { children, status } = props;

  if (status === "ready") return null;

  return (
    <div className=" bg-yellow-500 py-3 px-2.5 rounded-b-xl flex items-center gap-2">
      <AlertTriangleIcon />
      <p className=" text-xs md:text-sm font-medium text-black line-clamp-1">
        This video os still being processed
      </p>
    </div>
  );
};

export default VideoBanner;
