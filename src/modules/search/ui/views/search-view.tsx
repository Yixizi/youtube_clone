import React from "react";
import CategoriesSection from "../sections/categories-section";
import ResultsSection from "../sections/results-section";

export interface SearchViewProps {
  children?: React.ReactNode;

  query: string | undefined;
  categoryId: string | undefined;
}

const SearchView: React.FC<SearchViewProps> = async (props) => {
  const { query, categoryId } = props;

  return (
    <div className=" max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5">
      <CategoriesSection categoryId={categoryId} />
      <ResultsSection query={query} categoryId={categoryId} />
    </div>
  );
};

export default SearchView;
SearchView.displayName = "SearchView";
