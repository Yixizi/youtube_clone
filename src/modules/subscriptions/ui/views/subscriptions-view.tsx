import React, { memo } from "react";
import SubscriptonSection from "../sections/subscription-section";

export interface SubscriptonsViewProps {}

const SubscriptonsView: React.FC<SubscriptonsViewProps> = memo((props) => {
  return (
    <div
      className=" max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col
     gap-y-6 "
    >
      <div>
        <h1 className=" text-2xl font-bold">Subscriptions</h1>
        <p className=" text-xs text-muted-foreground ">
          View and manage all your subscriptions
        </p>
      </div>

      <SubscriptonSection />
    </div>
  );
});

export default SubscriptonsView;
SubscriptonsView.displayName = "SubscriptonsView";
