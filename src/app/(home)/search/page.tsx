export const dynamic = "force-dynamic";

import { DEFAULT_LIMIT } from "@/constants";
import SearchView from "@/modules/search/ui/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";

export interface SearchProps {

  searchParams: Promise<{
    query: string | undefined;
    categoryId: string | undefined;
  }>;
}

const Search: React.FC<SearchProps> = async (props) => {
  const { searchParams } = props;
  const { query, categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch();
  void trpc.homeSearch.getMany.prefetchInfinite({
    query,
    categoryId,
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <SearchView query={query} categoryId={categoryId} />
    </HydrateClient>
  );
};

export default Search;
// Search.displayName = "Search";
