import React, { memo } from "react";
import HomeTrendingSection from "../sections/home-trending-section";

export interface TrendingViewProps {}

const TrendingView: React.FC<TrendingViewProps> = memo((props) => {
  return (
    <div
      className=" max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col
     gap-y-6 "
    >
      <div>
        <h1 className=" text-2xl font-bold">Trending</h1>
        <p className=" text-xs text-muted-foreground ">
          Most popular videos at the moment
        </p>
      </div>

      <HomeTrendingSection />
    </div>
  );
});

export default TrendingView;
TrendingView.displayName = "TrendingView";
