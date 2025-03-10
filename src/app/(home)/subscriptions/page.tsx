export const dynamic = "force-dynamic";
import { DEFAULT_LIMIT } from "@/constants";
import SubscriptonsView from "@/modules/subscriptions/ui/views/subscriptions-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

export interface SubscriptonsProps {}

const Subscriptons: React.FC<SubscriptonsProps> = async (props) => {
  void trpc.subscriptions.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SubscriptonsView />
    </HydrateClient>
  );
};

export default Subscriptons;
Subscriptons.displayName = "Subscriptons";
