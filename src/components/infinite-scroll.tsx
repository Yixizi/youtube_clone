import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import React, { useEffect } from "react";
import { Button } from "./ui/button";

export interface InfiniteScrollProps {
 
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = (props) => {
  const {

    isManual = false,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = props;

  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage();
    }
  }, [
    isIntersecting,
    hasNextPage,
    isFetchingNextPage,
    isManual,
    fetchNextPage,
  ]);

  return (
    <div className=" flex flex-col items-center gap-4 p-4">
      <div ref={targetRef} className=" h-1"></div>
      {hasNextPage ? (
        <Button
          variant={"secondary"}
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          You have reached the end of the list
        </p>
      )}
    </div>
  );
};

export default InfiniteScroll;
InfiniteScroll.displayName = "InfiniteScroll";
