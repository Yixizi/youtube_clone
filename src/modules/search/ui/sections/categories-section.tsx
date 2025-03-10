"use client";

import FilterCarouse from "@/components/filter-carousel";
import { categories } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface CategoriesSectionProps {
  categoryId?: string;
}

const CategoriesSectionSuspense: React.FC<CategoriesSectionProps> = (props) => {
  const { categoryId } = props;

  const router = useRouter();
  const [categories] = trpc.categories.getMany.useSuspenseQuery();

  const data = categories.map(({ name, id }) => ({
    value: id,
    label: name,
  }));

  const onSelect = (value: string | null) => {
    const url = new URL(window.location.href);
    if (value) {
      url.searchParams.set("categoryId", value);
    } else {
      url.searchParams.delete("categoryId");
    }

    router.push(url.toString());
  };

  return (
    <FilterCarouse
      onSelect={onSelect}
      // isLoading
      value={categoryId}
      data={data}
    ></FilterCarouse>
  );
};

const CategoriesSkeleton = () => {
  return <FilterCarouse isLoading data={[]} onSelect={() => {}} />;
};

const CategoriesSection: React.FC<CategoriesSectionProps> = (props) => {
  const { categoryId } = props;

  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <CategoriesSectionSuspense
          categoryId={categoryId}
        ></CategoriesSectionSuspense>
      </ErrorBoundary>
    </Suspense>
  );
};

export default CategoriesSection;
