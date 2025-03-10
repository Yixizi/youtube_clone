import React, { Suspense } from "react";
import VideoSection from "../ui/sections/videos-section";

export interface StudioViewProps {}

const StudioViewSuspense: React.FC<StudioViewProps> = (props) => {
  return (
    <div className="flex flex-col gap-y-6 pt-2.5">
      <div className="px-4">
        <h1 className=" text-2xl font-bold">Channel content</h1>
        <p className=" text-xs text-muted-foreground">
          Manage your channel content and videos
        </p>
      </div>
      <VideoSection />
    </div>
  );
};

const StudioView = () => {
  return (
    <Suspense fallback={<p>....</p>}>
      <StudioViewSuspense />
    </Suspense>
  );
};

export default StudioView;
StudioView.displayName = "StudioView";
