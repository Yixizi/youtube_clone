import React, { memo } from "react";
import HomeTrendingSection from "../sections/home-trending-section";
import SubscribedVideosSection from "../sections/subscribed-videos-section";

export interface SubscribedViewProps {}

const SubscribedView: React.FC<SubscribedViewProps> = memo((props) => {
  return (
    <div
      className=" max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col
     gap-y-6 "
    >
      <div>
        <h1 className=" text-2xl font-bold">Subscripted</h1>
        <p className=" text-xs text-muted-foreground ">
          Videos from your favorite creators
        </p>
      </div>

      <SubscribedVideosSection />
    </div>
  );
});

export default SubscribedView;
SubscribedView.displayName = "SubscribedView";
